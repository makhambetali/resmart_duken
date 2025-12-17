/**
 * EditableInvoiceTable - Интерактивный редактор таблиц для накладных
 */

import React, { useState, useEffect, useCallback } from 'react';
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
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TableCell {
  value: string;
  isEditing: boolean;
  isCalculated?: boolean;
  formula?: string;
}

interface TableRow {
  id: string;
  cells: TableCell[];
}

interface ParsedTable {
  headers: string[];
  rows: TableRow[];
  priceColumnIndex: number | null;
}

interface EditableInvoiceTableProps {
  html: string;
  onHtmlChange: (newHtml: string) => void;
  className?: string;
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

  if (t === '№' || t.includes('no')) return 'index';
  if (t.includes('наимен')) return 'name';
  if (t.includes('номен')) return 'sku';
  if (t.includes('ед')) return 'unit';
  if (t.includes('колич')) return 'quantity';
  if (t.includes('цен')) return 'price';
  if (t.includes('ндс')) return 'vat';
  if (t.includes('сумм')) return 'total';

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
  return r.slice(0, length).map(v => ({ value: v, isEditing: false }));
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
const parseHtmlTable = (html: string): ParsedTable[] => {
  const rawRows = extractRawTable(html);
  if (!rawRows.length) return [];

  const { headerRows, dataRows } = splitHeaderAndData(rawRows);
  if (!dataRows.length) return [];

  const columnCount = Math.max(...rawRows.map(r => r.length));
  const { headers, columnTypes } = buildLogicalHeaders(headerRows, columnCount);

  const rows: TableRow[] = dataRows.map((row, idx) => {
    const cells = normalizeRow(row, columnCount);
    autofixQuantities(cells, columnTypes);

    return {
      id: `row-${idx}-${Date.now()}`,
      cells,
    };
  });

  // определяем колонку цены семантически
  const priceColumnIndex =
    columnTypes.findIndex(t => t === 'price') ?? null;

  return [
    {
      headers,
      rows,
      priceColumnIndex: priceColumnIndex >= 0 ? priceColumnIndex : null,
    },
  ];
};

// Генерация HTML из структуры данных
const generateHtml = (tables: ParsedTable[]): string => {
  return tables.map((table, tableIndex) => {
    const headerHtml = table.headers.length > 0 
      ? `<thead><tr>${table.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>`
      : '';
    
    const bodyHtml = `<tbody>${table.rows.map(row => 
      `<tr>${row.cells.map(cell => `<td>${cell.value}</td>`).join('')}</tr>`
    ).join('')}</tbody>`;
    
    return `<table class="invoice-table" data-table-index="${tableIndex}">${headerHtml}${bodyHtml}</table>`;
  }).join('\n');
};

export const EditableInvoiceTable: React.FC<EditableInvoiceTableProps> = ({
  html,
  onHtmlChange,
  className,
}) => {
  const [tables, setTables] = useState<ParsedTable[]>([]);
  const [markupPercent, setMarkupPercent] = useState(20);
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalTables, setOriginalTables] = useState<ParsedTable[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

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

  const updateHtml = useCallback((newTables: ParsedTable[]) => {
    const newHtml = generateHtml(newTables);
    onHtmlChange(newHtml);
  }, [onHtmlChange]);

  const handleCellChange = (
    tableIndex: number, 
    rowIndex: number, 
    cellIndex: number, 
    value: string
  ) => {
    if (!isEditMode) return;
    
    setTables(prev => {
      const newTables = [...prev];
      newTables[tableIndex] = {
        ...newTables[tableIndex],
        rows: newTables[tableIndex].rows.map((row, rIdx) => 
          rIdx === rowIndex 
            ? {
                ...row,
                cells: row.cells.map((cell, cIdx) => 
                  cIdx === cellIndex ? { ...cell, value } : cell
                )
              }
            : row
        )
      };
      return newTables;
    });
    setHasChanges(true);
  };

  const handleHeaderChange = (tableIndex: number, headerIndex: number, value: string) => {
    if (!isEditMode) return;
    
    setTables(prev => {
      const newTables = [...prev];
      newTables[tableIndex] = {
        ...newTables[tableIndex],
        headers: newTables[tableIndex].headers.map((h, idx) => 
          idx === headerIndex ? value : h
        )
      };
      return newTables;
    });
    setHasChanges(true);
  };

  const addRow = (tableIndex: number) => {
    if (!isEditMode) return;
    
    setTables(prev => {
      const newTables = [...prev];
      const colCount = Math.max(
        newTables[tableIndex].headers.length,
        newTables[tableIndex].rows[0]?.cells.length || 1
      );
      
      newTables[tableIndex] = {
        ...newTables[tableIndex],
        rows: [
          ...newTables[tableIndex].rows,
          {
            id: `row-new-${Date.now()}`,
            cells: Array(colCount).fill(null).map(() => ({ value: '', isEditing: false }))
          }
        ]
      };
      return newTables;
    });
    setHasChanges(true);
  };

  const deleteRow = (tableIndex: number, rowIndex: number) => {
    if (!isEditMode) return;
    
    setTables(prev => {
      const newTables = [...prev];
      newTables[tableIndex] = {
        ...newTables[tableIndex],
        rows: newTables[tableIndex].rows.filter((_, idx) => idx !== rowIndex)
      };
      return newTables;
    });
    setHasChanges(true);
  };

  const addColumn = (tableIndex: number) => {
    if (!isEditMode) return;
    
    setTables(prev => {
      const newTables = [...prev];
      newTables[tableIndex] = {
        ...newTables[tableIndex],
        headers: [...newTables[tableIndex].headers, 'Новый столбец'],
        rows: newTables[tableIndex].rows.map(row => ({
          ...row,
          cells: [...row.cells, { value: '', isEditing: false }]
        }))
      };
      return newTables;
    });
    setHasChanges(true);
  };

  const deleteColumn = (tableIndex: number, colIndex: number) => {
    if (!isEditMode) return;
    
    setTables(prev => {
      const newTables = [...prev];
      newTables[tableIndex] = {
        ...newTables[tableIndex],
        headers: newTables[tableIndex].headers.filter((_, idx) => idx !== colIndex),
        rows: newTables[tableIndex].rows.map(row => ({
          ...row,
          cells: row.cells.filter((_, idx) => idx !== colIndex)
        })),
        priceColumnIndex: newTables[tableIndex].priceColumnIndex === colIndex 
          ? null 
          : newTables[tableIndex].priceColumnIndex
      };
      return newTables;
    });
    setHasChanges(true);
  };

  const setPriceColumn = (tableIndex: number, colIndex: number) => {
    if (!isEditMode) return;
    
    setTables(prev => {
      const newTables = [...prev];
      newTables[tableIndex] = {
        ...newTables[tableIndex],
        priceColumnIndex: colIndex
      };
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

  const applyMarkupToTable = (tableIndex: number) => {
    if (!isEditMode) return;
    
    const table = tables[tableIndex];
    if (table.priceColumnIndex === null) return;

    setTables(prev => {
      const newTables = [...prev];
      const priceIdx = table.priceColumnIndex!;
      
      const newHeaders = [...newTables[tableIndex].headers];
      newHeaders.splice(priceIdx + 1, 0, `Цена +${markupPercent}%`);
      
      const newRows = newTables[tableIndex].rows.map(row => {
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

      newTables[tableIndex] = {
        ...newTables[tableIndex],
        headers: newHeaders,
        rows: newRows,
        priceColumnIndex: priceIdx
      };
      
      return newTables;
    });
    setHasChanges(true);
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
  };

  const handleCreateEmptyTable = () => {
    const emptyTable: ParsedTable = {
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
          ]
        }
      ],
      priceColumnIndex: 3
    };
    
    setTables([emptyTable]);
    setOriginalTables(JSON.parse(JSON.stringify([emptyTable])));
    setIsEditMode(true);
    setHasChanges(true);
  };

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
            onClick={() => tables.forEach((_, idx) => applyMarkupToTable(idx))}
            className="gap-2 bg-white border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            <Plus className="w-4 h-4" />
            Добавить столбец наценки
          </Button>
        </div>
      )}

      {/* Таблицы */}
      {tables.map((table, tableIndex) => (
        <div key={tableIndex} className="space-y-3">
          {tables.length > 1 && (
            <h4 className="text-sm font-semibold text-muted-foreground">
              Таблица {tableIndex + 1}
            </h4>
          )}
          
          {/* Кнопки управления таблицей (только в режиме редактирования) */}
          {isEditMode && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addRow(tableIndex)}
                className="gap-1.5 text-xs"
              >
                <Rows className="w-3.5 h-3.5" />
                Добавить строку
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addColumn(tableIndex)}
                className="gap-1.5 text-xs"
              >
                <Columns className="w-3.5 h-3.5" />
                Добавить столбец
              </Button>
              {table.priceColumnIndex !== null && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => applyMarkupToTable(tableIndex)}
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
                              onChange={(e) => handleHeaderChange(tableIndex, headerIndex, e.target.value)}
                              className="border-0 bg-transparent font-semibold text-center h-10 focus-visible:ring-1 focus-visible:ring-primary"
                            />
                          ) : (
                            <div className="px-3 py-2 font-semibold text-center w-full">
                              {header}
                            </div>
                          )}
                          {isEditMode && (
                            <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 hover:bg-primary/10 hover:text-primary"
                                onClick={() => setPriceColumn(tableIndex, headerIndex)}
                                title="Установить как колонку цены"
                              >
                                <Calculator className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => deleteColumn(tableIndex, headerIndex)}
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
                {table.rows.map((row, rowIndex) => (
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
                            onClick={() => deleteRow(tableIndex, rowIndex)}
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
                          table.priceColumnIndex === cellIndex && "bg-amber-50/50"
                        )}
                      >
                        {isEditMode ? (
                          <Input
                            value={cell.value}
                            onChange={(e) => handleCellChange(tableIndex, rowIndex, cellIndex, e.target.value)}
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
                          >
                            {cell.value}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EditableInvoiceTable;