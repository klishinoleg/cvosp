import {FC} from "react";
import {useTranslation} from "react-i18next";
import {helperLanguage} from "../../../helpers/helperLanguage.ts";
import {Button} from "antd";
import {DEFAULT_LANGUAGE, LANGUAGES} from "../../../constanst/vars.ts";
import {SidebarCardCenter} from "../../styled/SidebarCard.ts";


export const BlockLanguageSwitcher: FC = () => {
    const {i18n} = useTranslation();
    const [_, setLang] = helperLanguage(DEFAULT_LANGUAGE);

    const setLanguage = (language: string) => {
        i18n.changeLanguage(language).then(() => {
            setLang(language);
        });
    };

    return (
        <SidebarCardCenter>
            <Button.Group>
                {LANGUAGES.map((language: string) => (
                    <Button
                        key={`languageButton-${language}`}
                        type={i18n.language === language ? "primary" : "default"}
                        onClick={() => setLanguage(language)}
                    >
                        {language.toUpperCase()}
                    </Button>
                ))}
            </Button.Group>
        </SidebarCardCenter>
    );
};
