from django.core.cache import cache
class CacheService:
    def get_cache(self, key):
        cached_value = cache.get(key)
        if cached_value:
            print(f"CACHE GET: {key}")
            return cached_value
        
        return None

    def set_cache(self, key, value, lifetime = 5 * 60):
        cache.set(key, value, lifetime)
        print(f"CACHE SET: {key} for {lifetime}")

    def delete_cache(self, key):
        cache.delete(key)
        print(f"CACHE DELETE: {key}")