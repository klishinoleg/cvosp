import os
from pathlib import Path
from app.cfg.constants import LANGUAGES
from fastapi18n.wrappers import TranslationWrapper

LOCALES_DIR = os.path.join(Path(__file__).parent, "locales")
TranslationWrapper.init(locales_dir=LOCALES_DIR, language=LANGUAGES[0], languages=tuple((l, l) for l in LANGUAGES))


def get_locale() -> str:
    return TranslationWrapper.get_instance().get_locale()


def activate(locale: str or None, use_context: bool = True):
    TranslationWrapper.get_instance().set_locale(locale, use_context=use_context)


def translate(text: str) -> str:
    return TranslationWrapper.get_instance().gettext(text)
