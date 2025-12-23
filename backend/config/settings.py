import os
from pathlib import Path

# =========================
# BASE
# =========================
BASE_DIR = Path(__file__).resolve().parent.parent

# =========================
# SECURITY
# =========================
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "unsafe-secret-key")

DEBUG = os.getenv("DJANGO_DEBUG", "False") == "True"

ALLOWED_HOSTS = os.getenv(
    "DJANGO_ALLOWED_HOSTS",
    "localhost,127.0.0.1"
).split(",")

# =========================
# APPLICATIONS
# =========================
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'app',
    'rest_framework',
    'drf_yasg',
    'corsheaders',
    'django_celery_beat'
]

# =========================
# MIDDLEWARE
# =========================
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# =========================
# URLS / WSGI
# =========================
ROOT_URLCONF = "config.urls"

WSGI_APPLICATION = "config.wsgi.application"

# =========================
# TEMPLATES
# =========================
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]
LANGUAGE_CODE = 'ru'
TIME_ZONE = 'Asia/Qyzylorda'
USE_I18N = True
USE_L10N = True
USE_TZ = True
# =========================
# DATABASE (PostgreSQL)
# =========================
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME"),
        "USER": os.getenv("DB_USER"),
        "PASSWORD": os.getenv("DB_PASSWORD"),
        "HOST": os.getenv("DB_HOST", "localhost"),
        "PORT": os.getenv("DB_PORT", "5432"),
    }
}

# =========================
# AUTH PASSWORD VALIDATORS
# =========================
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# =========================
# INTERNATIONALIZATION
# =========================
LANGUAGE_CODE = os.getenv("DJANGO_LANGUAGE_CODE", "ru")

TIME_ZONE = os.getenv("DJANGO_TIMEZONE", "Asia/Qyzylorda")

USE_I18N = True
USE_TZ = True

# =========================
# STATIC / MEDIA
# =========================
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"


MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# =========================
# DEFAULT PK
# =========================
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# =========================
# CORS
# =========================
CORS_ALLOW_ALL_ORIGINS = True

CORS_ALLOW_CREDENTIALS = True

# =========================
# REDIS / CELERY
# =========================
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = os.getenv("REDIS_PORT", "6379")

CELERY_BROKER_URL = f"redis://{REDIS_HOST}:{REDIS_PORT}/0"
CELERY_RESULT_BACKEND = CELERY_BROKER_URL

CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = TIME_ZONE

# =========================
# LOGGING (чтобы видеть всё в Docker)
# =========================
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
}
