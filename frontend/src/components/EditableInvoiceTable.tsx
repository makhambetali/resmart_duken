/**
 * EditableInvoiceTable - Интерактивный редактор таблиц для накладных
 * Поддержка нескольких таблиц и live-поиска
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Trash2, 
  Calculator,
  GripVertical,
  Columns,
  Rows,
  Pencil,
  Save,
  X,
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TableCell {
  value: string;
  isEditing: boolean;
  isCalculated?: boolean;
  formula?: string;
  originalValue?: string; // Для поиска и подсветки
}

interface TableRow {
  id: string;
  cells: TableCell[];
  isVisible?: boolean; // Для фильтрации
}

interface ParsedTable {
  id: string;
  headers: string[];
  rows: TableRow[];
  priceColumnIndex: number | null;
  columnTypes: ColumnType[];
  isCollapsed?: boolean; // Для сворачивания таблицы
  isVisible?: boolean; // Для фильтрации по таблице
}

interface EditableInvoiceTableProps {
  html: string;
  onHtmlChange: (newHtml: string) => void;
  className?: string;
  searchQuery?: string; // Внешний поисковый запрос (опционально)
}

// Функция для парсинга числа из строки с разными форматами
const parseNumber = (value: string): number => {
  const cleaned = value.replace(/[^\d.,]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};

// Форматирование числа как цены
const formatNumber = (num: number): string => {
  return num.toLocaleString('ru-RU', { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 2 
  });
};

type ColumnType =
  | 'index'
  | 'name'
  | 'sku'
  | 'unit'
  | 'quantity'
  | 'price'
  | 'total'
  | 'vat'
  | 'unknown';

const extractRawTable = (html: string): string[][] => {
  if (!html) return [];
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const table = doc.querySelector('table');
  if (!table) return [];

  return Array.from(table.querySelectorAll('tr'))
    .map(tr => Array.from(tr.cells).map(td => td.textContent?.trim() || ''))
    .filter(row => row.some(cell => cell.length > 0));
};

const isHeaderRow = (row: string[]) => {
  const digitCount = row.filter(c => /\d/.test(c)).length;
  return digitCount < row.length / 2;
};

const splitHeaderAndData = (rows: string[][]) => {
  const headerRows: string[][] = [];
  const dataRows: string[][] = [];

  for (const row of rows) {
    if (headerRows.length < 2 && isHeaderRow(row)) {
      headerRows.push(row);
    } else {
      dataRows.push(row);
    }
  }

  return { headerRows, dataRows };
};

const detectColumnType = (text: string): ColumnType => {
  const t = text.toLowerCase();

  if (t === '№' || t.includes('no') || t.includes('номер')) return 'index';
  if (t.includes('наимен') || t.includes('товар') || t.includes('продукт') || t.includes('название')) return 'name';
  if (t.includes('номен') || t.includes('артикул') || t.includes('код')) return 'sku';
  if (t.includes('ед') || t.includes('измер') || t.includes('unit')) return 'unit';
  if (t.includes('колич') || t.includes('кол-во') || t.includes('amount')) return 'quantity';
  if (t.includes('цен') || t.includes('price') || t.includes('стоимость')) return 'price';
  if (t.includes('ндс') || t.includes('vat') || t.includes('налог')) return 'vat';
  if (t.includes('сумм') || t.includes('total') || t.includes('итого')) return 'total';

  return 'unknown';
};

const buildLogicalHeaders = (
  headerRows: string[][],
  columnCount: number
) => {
  const headers: string[] = [];
  const columnTypes: ColumnType[] = [];

  for (let i = 0; i < columnCount; i++) {
    const top = headerRows[0]?.[i] || '';
    const sub = headerRows[1]?.[i] || '';

    const headerText =
      sub && top
        ? `${top}: ${sub}`
        : top || sub || `Колонка ${i + 1}`;

    headers.push(headerText);
    columnTypes.push(detectColumnType(headerText));
  }

  return { headers, columnTypes };
};

const normalizeRow = (row: string[], length: number): TableCell[] => {
  const r = [...row];
  while (r.length < length) r.push('');
  return r.slice(0, length).map(v => ({ 
    value: v, 
    isEditing: false,
    originalValue: v
  }));
};

const autofixQuantities = (cells: TableCell[], columnTypes: ColumnType[]) => {
  for (let i = 0; i < columnTypes.length - 1; i++) {
    if (
      columnTypes[i] === 'quantity' &&
      !cells[i].value &&
      cells[i + 1].value
    ) {
      cells[i].value = cells[i + 1].value;
    }
  }
};

// Разделение HTML на отдельные таблицы
const splitHtmlIntoTables = (html: string): string[] => {
  if (!html) return [];
  
  const tables: string[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Ищем разделители таблиц
  const htmlParts = html.split(/<br\s*\/?>\s*<br\s*\/?>|<!--\s*Новая таблица\s*-->|<\/table>\s*<table/gi);
  
  if (htmlParts.length > 1) {
    // Есть разделители - обрабатываем каждую часть
    htmlParts.forEach(part => {
      if (part.trim()) {
        const tempDoc = parser.parseFromString(part.includes('<table') ? part : `<table>${part}</table>`, 'text/html');
        const tableElements = tempDoc.querySelectorAll('table');
        tableElements.forEach(table => tables.push(table.outerHTML));
      }
    });
  } else {
    // Нет разделителей - ищем все таблицы в HTML
    const tableElements = doc.querySelectorAll('table');
    tableElements.forEach(table => tables.push(table.outerHTML));
  }
  
  return tables.filter(table => table.trim());
};

const parseHtmlTable = (html: string): ParsedTable[] => {
  if (!html) return [];
  
  const tableHtmls = splitHtmlIntoTables(html);
  if (!tableHtmls.length) return [];
  
  const parsedTables: ParsedTable[] = [];
  
  tableHtmls.forEach((tableHtml, tableIndex) => {
    const rawRows = extractRawTable(tableHtml);
    if (!rawRows.length) return;
    
    const { headerRows, dataRows } = splitHeaderAndData(rawRows);
    if (!dataRows.length) return;
    
    const columnCount = Math.max(...rawRows.map(r => r.length));
    const { headers, columnTypes } = buildLogicalHeaders(headerRows, columnCount);
    
    const rows: TableRow[] = dataRows.map((row, idx) => {
      const cells = normalizeRow(row, columnCount);
      autofixQuantities(cells, columnTypes);
      
      return {
        id: `row-${tableIndex}-${idx}-${Date.now()}`,
        cells,
        isVisible: true
      };
    });
    
    const priceColumnIndex = columnTypes.findIndex(t => t === 'price');
    
    parsedTables.push({
      id: `table-${tableIndex}-${Date.now()}`,
      headers,
      rows,
      priceColumnIndex: priceColumnIndex >= 0 ? priceColumnIndex : null,
      columnTypes,
      isCollapsed: false,
      isVisible: true
    });
  });
  
  return parsedTables;
};

// Генерация HTML из структуры данных
const generateHtml = (tables: ParsedTable[]): string => {
  return tables.map((table, tableIndex) => {
    const headerHtml = table.headers.length > 0 
      ? `<thead><tr>${table.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>`
      : '';
    
    const visibleRows = table.rows.filter(row => row.isVisible !== false);
    const bodyHtml = visibleRows.length > 0
      ? `<tbody>${visibleRows.map(row => 
          `<tr>${row.cells.map(cell => `<td>${cell.value}</td>`).join('')}</tr>`
        ).join('')}</tbody>`
      : '';
    
    const tableHtml = `<table class="invoice-table" data-table-index="${tableIndex}">${headerHtml}${bodyHtml}</table>`;
    
    // Добавляем разделитель между таблицами, если это не последняя таблица
    return tableHtml + (tableIndex < tables.length - 1 ? '\n<br/><br/>\n' : '');
  }).join('');
};

// Поиск по всем таблицам
const searchInTables = (tables: ParsedTable[], query: string): ParsedTable[] => {
  if (!query.trim()) {
    return tables.map(table => ({
      ...table,
      rows: table.rows.map(row => ({
        ...row,
        isVisible: true,
        cells: row.cells.map(cell => ({
          ...cell,
          originalValue: cell.originalValue || cell.value
        }))
      }))
    }));
  }
  
  const searchTerm = query.toLowerCase().trim();
  
  return tables.map(table => {
    // Сначала проверяем, есть ли в таблице вообще совпадения
    const hasMatches = table.rows.some(row =>
      row.cells.some(cell => 
        cell.value.toLowerCase().includes(searchTerm)
      )
    );
    
    // Обновляем таблицу с видимостью строк
    return {
      ...table,
      isVisible: hasMatches,
      rows: table.rows.map(row => {
        const hasRowMatches = row.cells.some(cell => 
          cell.value.toLowerCase().includes(searchTerm)
        );
        
        return {
          ...row,
          isVisible: hasRowMatches,
          cells: row.cells.map(cell => {
            const cellValue = cell.value.toLowerCase();
            const hasMatch = cellValue.includes(searchTerm);
            
            return {
              ...cell,
              originalValue: cell.originalValue || cell.value,
              value: hasMatch 
                ? cell.value.replace(
                    new RegExp(`(${searchTerm})`, 'gi'),
                    '<mark class="bg-yellow-200 text-black px-0.5 rounded">$1</mark>'
                  )
                : cell.value
            };
          })
        };
      })
    };
  });
};

export const EditableInvoiceTable: React.FC<EditableInvoiceTableProps> = ({
  html,
  onHtmlChange,
  className,
  searchQuery = '' // По умолчанию пустая строка
}) => {
  const [tables, setTables] = useState<ParsedTable[]>([]);
  const [markupPercent, setMarkupPercent] = useState(20);
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalTables, setOriginalTables] = useState<ParsedTable[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [showSearch, setShowSearch] = useState(false);
  const [filteredTables, setFilteredTables] = useState<ParsedTable[]>([]);
  const [statistics, setStatistics] = useState({
    totalTables: 0,
    totalRows: 0,
    totalItems: 0,
    visibleTables: 0,
    visibleRows: 0
  });

  // Инициализация таблиц из HTML
  useEffect(() => {
    if (html) {
      const parsed = parseHtmlTable(html);
      setTables(parsed);
      setOriginalTables(JSON.parse(JSON.stringify(parsed)));
      setHasChanges(false);
    } else {
      setTables([]);
      setOriginalTables([]);
      setHasChanges(false);
    }
  }, [html]);

  // Обработка поиска при изменении запроса
  useEffect(() => {
    if (searchQuery) {
      setSearchInput(searchQuery);
      const filtered = searchInTables(tables, searchQuery);
      setFilteredTables(filtered);
    } else if (searchInput) {
      const filtered = searchInTables(tables, searchInput);
      setFilteredTables(filtered);
    } else {
      setFilteredTables(tables);
    }
  }, [tables, searchInput, searchQuery]);

  // Вычисление статистики
  useEffect(() => {
    const visibleTables = filteredTables.filter(t => t.isVisible !== false).length;
    const visibleRows = filteredTables.reduce((sum, table) => 
      sum + table.rows.filter(r => r.isVisible !== false).length, 0
    );
    const totalItems = tables.reduce((sum, table) => 
      sum + table.rows.reduce((rowSum, row) => 
        rowSum + row.cells.filter(c => c.value.trim()).length, 0
      ), 0
    );

    setStatistics({
      totalTables: tables.length,
      totalRows: tables.reduce((sum, table) => sum + table.rows.length, 0),
      totalItems,
      visibleTables,
      visibleRows
    });
  }, [filteredTables, tables]);

  const updateHtml = useCallback((newTables: ParsedTable[]) => {
    const newHtml = generateHtml(newTables);
    onHtmlChange(newHtml);
  }, [onHtmlChange]);

  const handleCellChange = (
    tableId: string, 
    rowId: string, 
    cellIndex: number, 
    value: string
  ) => {
    if (!isEditMode) return;
    
    setTables(prev => {
      const newTables = prev.map(table => {
        if (table.id !== tableId) return table;
        
        return {
          ...table,
          rows: table.rows.map(row => {
            if (row.id !== rowId) return row;
            
            return {
              ...row,
              cells: row.cells.map((cell, cIdx) => 
                cIdx === cellIndex ? { ...cell, value } : cell
              )
            };
          })
        };
      });
      
      return newTables;
    });
    setHasChanges(true);
  };

  const handleHeaderChange = (tableId: string, headerIndex: number, value: string) => {
    if (!isEditMode) return;
    
    setTables(prev => {
      const newTables = prev.map(table => {
        if (table.id !== tableId) return table;
        
        const newHeaders = [...table.headers];
        newHeaders[headerIndex] = value;
        
        return {
          ...table,
          headers: newHeaders
        };
      });
      
      return newTables;
    });
    setHasChanges(true);
  };

  const addRow = (tableId: string) => {
    if (!isEditMode) return;
    
    setTables(prev => {
      const newTables = prev.map(table => {
        if (table.id !== tableId) return table;
        
        const colCount = Math.max(
          table.headers.length,
          table.rows[0]?.cells.length || 1
        );
        
        const newRow: TableRow = {
          id: `row-new-${Date.now()}`,
          cells: Array(colCount).fill(null).map(() => ({ 
            value: '', 
            isEditing: false 
          })),
          isVisible: true
        };
        
        return {
          ...table,
          rows: [...table.rows, newRow]
        };
      });
      
      return newTables;
    });
    setHasChanges(true);
  };

  const deleteRow = (tableId: string, rowId: string) => {
    if (!isEditMode) return;
    
    setTables(prev => {
      const newTables = prev.map(table => {
        if (table.id !== tableId) return table;
        
        return {
          ...table,
          rows: table.rows.filter(row => row.id !== rowId)
        };
      });
      
      return newTables;
    });
    setHasChanges(true);
  };

  const addColumn = (tableId: string) => {
    if (!isEditMode) return;
    
    setTables(prev => {
      const newTables = prev.map(table => {
        if (table.id !== tableId) return table;
        
        return {
          ...table,
          headers: [...table.headers, 'Новый столбец'],
          rows: table.rows.map(row => ({
            ...row,
            cells: [...row.cells, { value: '', isEditing: false }]
          }))
        };
      });
      
      return newTables;
    });
    setHasChanges(true);
  };

  const deleteColumn = (tableId: string, colIndex: number) => {
    if (!isEditMode) return;
    
    setTables(prev => {
      const newTables = prev.map(table => {
        if (table.id !== tableId) return table;
        
        return {
          ...table,
          headers: table.headers.filter((_, idx) => idx !== colIndex),
          rows: table.rows.map(row => ({
            ...row,
            cells: row.cells.filter((_, idx) => idx !== colIndex)
          })),
          priceColumnIndex: table.priceColumnIndex === colIndex 
            ? null 
            : table.priceColumnIndex
        };
      });
      
      return newTables;
    });
    setHasChanges(true);
  };

  const setPriceColumn = (tableId: string, colIndex: number) => {
    if (!isEditMode) return;
    
    setTables(prev => {
      const newTables = prev.map(table => {
        if (table.id !== tableId) return table;
        
        return {
          ...table,
          priceColumnIndex: colIndex
        };
      });
      
      return newTables;
    });
    setHasChanges(true);
  };

  const calculateMarkup = (value: string): string => {
    const num = parseNumber(value);
    if (num === 0) return '-';
    const marked = num * (1 + markupPercent / 100);
    return formatNumber(marked);
  };

  const applyMarkupToTable = (tableId: string) => {
    if (!isEditMode) return;
    
    setTables(prev => {
      const newTables = prev.map(table => {
        if (table.id !== tableId || table.priceColumnIndex === null) return table;
        
        const priceIdx = table.priceColumnIndex;
        const newHeaders = [...table.headers];
        newHeaders.splice(priceIdx + 1, 0, `Цена +${markupPercent}%`);
        
        const newRows = table.rows.map(row => {
          const newCells = [...row.cells];
          const priceValue = row.cells[priceIdx]?.value || '0';
          const markupValue = calculateMarkup(priceValue);
          newCells.splice(priceIdx + 1, 0, { 
            value: markupValue, 
            isEditing: false,
            isCalculated: true,
            formula: `${priceIdx}*${1 + markupPercent/100}`
          });
          return { ...row, cells: newCells };
        });

        return {
          ...table,
          headers: newHeaders,
          rows: newRows,
          priceColumnIndex: priceIdx
        };
      });
      
      return newTables;
    });
    setHasChanges(true);
  };

  const toggleTableCollapse = (tableId: string) => {
    setTables(prev => 
      prev.map(table => 
        table.id === tableId 
          ? { ...table, isCollapsed: !table.isCollapsed }
          : table
      )
    );
  };

  const duplicateTable = (tableId: string) => {
    if (!isEditMode) return;
    
    setTables(prev => {
      const tableToDuplicate = prev.find(t => t.id === tableId);
      if (!tableToDuplicate) return prev;
      
      const duplicatedTable = {
        ...tableToDuplicate,
        id: `table-copy-${Date.now()}`,
        rows: tableToDuplicate.rows.map(row => ({
          ...row,
          id: `row-copy-${Date.now()}-${Math.random()}`,
          cells: row.cells.map(cell => ({ ...cell }))
        }))
      };
      
      const index = prev.findIndex(t => t.id === tableId);
      const newTables = [...prev];
      newTables.splice(index + 1, 0, duplicatedTable);
      
      return newTables;
    });
    setHasChanges(true);
  };

  const deleteTable = (tableId: string) => {
    if (!isEditMode) return;
    
    setTables(prev => prev.filter(table => table.id !== tableId));
    setHasChanges(true);
  };

  const addNewTable = () => {
    if (!isEditMode) return;
    
    const newTable: ParsedTable = {
      id: `table-new-${Date.now()}`,
      headers: ['Наименование', 'Количество', 'Ед. изм.', 'Цена', 'Сумма'],
      rows: [
        {
          id: `row-empty-${Date.now()}`,
          cells: [
            { value: '', isEditing: false },
            { value: '', isEditing: false },
            { value: 'шт', isEditing: false },
            { value: '', isEditing: false },
            { value: '', isEditing: false }
          ],
          isVisible: true
        }
      ],
      priceColumnIndex: 3,
      columnTypes: ['name', 'quantity', 'unit', 'price', 'total'],
      isCollapsed: false,
      isVisible: true
    };
    
    setTables(prev => [...prev, newTable]);
    setHasChanges(true);
  };

  const handleSearch = (query: string) => {
    setSearchInput(query);
  };

  const clearSearch = () => {
    setSearchInput('');
    setFilteredTables(tables);
  };

  const handleStartEdit = () => {
    setOriginalTables(JSON.parse(JSON.stringify(tables)));
    setIsEditMode(true);
    setHasChanges(false);
  };

  const handleSave = () => {
    updateHtml(tables);
    setIsEditMode(false);
    setHasChanges(false);
  };

  const handleCancel = () => {
    setTables(JSON.parse(JSON.stringify(originalTables)));
    setIsEditMode(false);
    setHasChanges(false);
    setSearchInput('');
  };

  const handleCreateEmptyTable = () => {
    const emptyTable: ParsedTable = {
      id: `table-empty-${Date.now()}`,
      headers: ['Наименование', 'Количество', 'Ед. изм.', 'Цена', 'Сумма'],
      rows: [
        {
          id: 'row-empty-1',
          cells: [
            { value: '', isEditing: false },
            { value: '', isEditing: false },
            { value: 'шт', isEditing: false },
            { value: '', isEditing: false },
            { value: '', isEditing: false }
          ],
          isVisible: true
        }
      ],
      priceColumnIndex: 3,
      columnTypes: ['name', 'quantity', 'unit', 'price', 'total'],
      isCollapsed: false,
      isVisible: true
    };
    
    setTables([emptyTable]);
    setOriginalTables(JSON.parse(JSON.stringify([emptyTable])));
    setIsEditMode(true);
    setHasChanges(true);
  };

  // Отображаемые таблицы (с учетом поиска)
  const displayTables = searchInput ? filteredTables.filter(t => t.isVisible !== false) : tables;

  if (tables.length === 0 && !isEditMode) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
        <p className="mb-4">Нет данных для отображения</p>
        <Button
          size="sm"
          onClick={handleCreateEmptyTable}
          className="gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Создать пустую таблицу
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Панель управления */}
      <div className="space-y-3">
        {/* Кнопки режима редактирования */}
        <div className="flex items-center justify-between gap-3 p-3 bg-card rounded-lg border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {isEditMode ? (
              <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                <Pencil className="w-4 h-4" />
                Режим редактирования
                {hasChanges && <span className="text-green-600">*</span>}
              </span>
            ) : (
              <span>Режим просмотра</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Поиск */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
              className="gap-1.5"
            >
              <Search className="w-4 h-4" />
              Поиск
            </Button>
            
            {isEditMode ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="gap-1.5"
                >
                  <X className="w-4 h-4" />
                  Отмена
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Save className="w-4 h-4" />
                  Сохранить
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                onClick={handleStartEdit}
                className="gap-1.5"
              >
                <Pencil className="w-4 h-4" />
                Редактировать
              </Button>
            )}
          </div>
        </div>

        {/* Панель поиска */}
        {showSearch && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-600" />
              <Input
                type="text"
                placeholder="Поиск по наименованию товара..."
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                className="flex-1"
              />
              {searchInput && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            {/* Статистика поиска */}
            {searchInput && (
              <div className="mt-2 flex items-center gap-4 text-sm text-blue-700">
                <span>Найдено таблиц: {statistics.visibleTables}/{statistics.totalTables}</span>
                <span>Строк: {statistics.visibleRows}/{statistics.totalRows}</span>
                <Badge variant={statistics.visibleRows === 0 ? "destructive" : "outline"}>
                  {statistics.visibleRows === 0 ? "Нет результатов" : "Результаты найдены"}
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Панель инструментов (только в режиме редактирования) */}
        {isEditMode && (
          <div className="flex flex-wrap items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-700">Наценка:</span>
              <Input
                type="number"
                value={markupPercent}
                onChange={(e) => setMarkupPercent(Number(e.target.value))}
                className="w-20 h-8 text-center bg-white"
                min={0}
                max={500}
              />
              <span className="text-sm text-amber-600">%</span>
            </div>
            
            <div className="h-6 w-px bg-amber-300" />
            
            <Button
              variant="outline"
              size="sm"
              onClick={addNewTable}
              className="gap-2 bg-white border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              <Plus className="w-4 h-4" />
              Добавить таблицу
            </Button>
          </div>
        )}

        {/* Общая статистика */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <div className="p-2 bg-muted/30 rounded text-center">
            <div className="text-sm text-muted-foreground">Таблицы</div>
            <div className="text-lg font-semibold">{statistics.totalTables}</div>
          </div>
          <div className="p-2 bg-muted/30 rounded text-center">
            <div className="text-sm text-muted-foreground">Всего строк</div>
            <div className="text-lg font-semibold">{statistics.totalRows}</div>
          </div>
          <div className="p-2 bg-muted/30 rounded text-center">
            <div className="text-sm text-muted-foreground">Элементов</div>
            <div className="text-lg font-semibold">{statistics.totalItems}</div>
          </div>
          <div className="p-2 bg-muted/30 rounded text-center">
            <div className="text-sm text-muted-foreground">Столбцов в среднем</div>
            <div className="text-lg font-semibold">
              {tables.length > 0 
                ? Math.round(tables.reduce((sum, t) => sum + t.headers.length, 0) / tables.length)
                : 0}
            </div>
          </div>
          <div className="p-2 bg-muted/30 rounded text-center">
            <div className="text-sm text-muted-foreground">Ценовые столбцы</div>
            <div className="text-lg font-semibold">
              {tables.filter(t => t.priceColumnIndex !== null).length}
            </div>
          </div>
        </div>
      </div>

      {/* Таблицы */}
      <div className="space-y-6">
        {displayTables.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            <Filter className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">Ничего не найдено</p>
            <p className="text-sm">Попробуйте изменить поисковый запрос</p>
            {searchInput && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearSearch}
                className="mt-3"
              >
                Очистить поиск
              </Button>
            )}
          </div>
        ) : (
          displayTables.map((table) => (
            <div 
              key={table.id} 
              className={cn(
                "space-y-3 border rounded-lg p-4",
                table.isVisible === false && "opacity-50",
                isEditMode && "hover:border-primary/50 transition-colors"
              )}
            >
              {/* Заголовок таблицы */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleTableCollapse(table.id)}
                    className="h-8 w-8"
                  >
                    {table.isCollapsed ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                  </Button>
                  
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      Таблица #{tables.findIndex(t => t.id === table.id) + 1}
                      {table.priceColumnIndex !== null && (
                        <Badge variant="outline" className="text-xs">
                          <Calculator className="w-3 h-3 mr-1" />
                          Есть цены
                        </Badge>
                      )}
                      {searchInput && table.rows.filter(r => r.isVisible !== false).length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          <Search className="w-3 h-3 mr-1" />
                          {table.rows.filter(r => r.isVisible !== false).length} строк
                        </Badge>
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {table.headers.length} колонок, {table.rows.length} строк
                    </p>
                  </div>
                </div>
                
                {/* Кнопки управления таблицей */}
                {isEditMode && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => duplicateTable(table.id)}
                      className="h-8 w-8"
                      title="Дублировать таблицу"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTable(table.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      title="Удалить таблицу"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}
              </div>

              {!table.isCollapsed && (
                <>
                  {/* Кнопки управления таблицей (только в режиме редактирования) */}
                  {isEditMode && (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addRow(table.id)}
                        className="gap-1.5 text-xs"
                      >
                        <Rows className="w-3.5 h-3.5" />
                        Добавить строку
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addColumn(table.id)}
                        className="gap-1.5 text-xs"
                      >
                        <Columns className="w-3.5 h-3.5" />
                        Добавить столбец
                      </Button>
                      {table.priceColumnIndex !== null && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => applyMarkupToTable(table.id)}
                          className="gap-1.5 text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        >
                          <Calculator className="w-3.5 h-3.5" />
                          +{markupPercent}% к ценам
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Таблица */}
                  <div className="overflow-x-auto rounded-lg border shadow-sm">
                    <table className="w-full border-collapse">
                      {/* Заголовки */}
                      {table.headers.length > 0 && (
                        <thead>
                          <tr className="bg-muted/50">
                            {isEditMode && (
                              <th className="w-10 p-2 border-b border-r" />
                            )}
                            {table.headers.map((header, headerIndex) => (
                              <th 
                                key={headerIndex}
                                className="relative group border-b border-r last:border-r-0 p-0"
                              >
                                <div className="flex items-center">
                                  {isEditMode ? (
                                    <Input
                                      value={header}
                                      onChange={(e) => handleHeaderChange(table.id, headerIndex, e.target.value)}
                                      className="border-0 bg-transparent font-semibold text-center h-10 focus-visible:ring-1 focus-visible:ring-primary"
                                    />
                                  ) : (
                                    <div className="px-3 py-2 font-semibold text-center w-full">
                                      <div dangerouslySetInnerHTML={{ __html: header }} />
                                    </div>
                                  )}
                                  {isEditMode && (
                                    <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 hover:bg-primary/10 hover:text-primary"
                                        onClick={() => setPriceColumn(table.id, headerIndex)}
                                        title="Установить как колонку цены"
                                      >
                                        <Calculator className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                                        onClick={() => deleteColumn(table.id, headerIndex)}
                                        title="Удалить столбец"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                                {table.priceColumnIndex === headerIndex && (
                                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-primary text-primary-foreground text-[10px] rounded-full font-medium">
                                    Цена
                                  </div>
                                )}
                              </th>
                            ))}
                          </tr>
                        </thead>
                      )}
                      
                      {/* Тело таблицы */}
                      <tbody>
                        {table.rows
                          .filter(row => row.isVisible !== false)
                          .map((row, rowIndex) => (
                          <tr 
                            key={row.id}
                            className={cn(
                              "group transition-colors",
                              rowIndex % 2 === 0 ? "bg-background" : "bg-muted/30",
                              isEditMode && "hover:bg-primary/5"
                            )}
                          >
                            {/* Кнопки управления строкой (только в режиме редактирования) */}
                            {isEditMode && (
                              <td className="w-10 p-1 border-r border-b bg-muted/20">
                                <div className="flex flex-col items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <GripVertical className="w-3.5 h-3.5 text-muted-foreground" />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 hover:bg-destructive/10 hover:text-destructive"
                                    onClick={() => deleteRow(table.id, row.id)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </td>
                            )}
                            
                            {/* Ячейки */}
                            {row.cells.map((cell, cellIndex) => (
                              <td 
                                key={cellIndex}
                                className={cn(
                                  "border-b border-r last:border-r-0 p-0",
                                  cell.isCalculated && "bg-emerald-50",
                                  table.priceColumnIndex === cellIndex && "bg-amber-50/50",
                                  searchInput && cell.value.includes('<mark') && "bg-yellow-50"
                                )}
                              >
                                {isEditMode ? (
                                  <Input
                                    value={cell.value.replace(/<[^>]*>/g, '')} // Убираем HTML теги при редактировании
                                    onChange={(e) => handleCellChange(table.id, row.id, cellIndex, e.target.value)}
                                    className={cn(
                                      "border-0 bg-transparent h-9 text-center rounded-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary",
                                      cell.isCalculated && "text-emerald-700 font-medium",
                                      table.priceColumnIndex === cellIndex && "font-medium text-amber-700"
                                    )}
                                  />
                                ) : (
                                  <div 
                                    className={cn(
                                      "px-3 py-2 text-center min-h-[36px]",
                                      cell.isCalculated && "text-emerald-700 font-medium",
                                      table.priceColumnIndex === cellIndex && "font-medium text-amber-700"
                                    )}
                                    dangerouslySetInnerHTML={{ __html: cell.value }}
                                  />
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                        
                        {/* Сообщение если все строки скрыты */}
                        {table.rows.filter(r => r.isVisible !== false).length === 0 && table.rows.length > 0 && (
                          <tr>
                            <td 
                              colSpan={table.headers.length + (isEditMode ? 1 : 0)}
                              className="p-8 text-center text-muted-foreground"
                            >
                              <EyeOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <p>Нет видимых строк по текущему поиску</p>
                              {searchInput && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={clearSearch}
                                  className="mt-2"
                                >
                                  Очистить поиск
                                </Button>
                              )}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Статистика по таблице */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span>Столбцов: {table.headers.length}</span>
                      <span>Строк: {table.rows.filter(r => r.isVisible !== false).length}/{table.rows.length}</span>
                      {table.priceColumnIndex !== null && (
                        <span className="flex items-center gap-1">
                          <Calculator className="w-3.5 h-3.5" />
                          Цены в столбце {table.priceColumnIndex + 1}
                        </span>
                      )}
                    </div>
                    <div className="text-xs">
                      ID: {table.id.slice(0, 8)}...
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Кнопки для пустого состояния при поиске */}
      {searchInput && displayTables.length > 0 && (
        <div className="text-center pt-4">
          <Button
            variant="outline"
            onClick={clearSearch}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            Показать все таблицы ({statistics.totalTables})
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditableInvoiceTable;