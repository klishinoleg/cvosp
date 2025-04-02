import {App, ConfigProvider} from 'antd';
import {FC} from "react";
import {Provider} from "react-redux"
import {store} from "./store/store.ts";
import {PageContainer} from "./components/containers/PageContainer.tsx";
import {useTranslation} from "react-i18next";
import {DEFAULT_LANGUAGE} from "./constanst/vars.ts";


const MyApp: FC = () => {
    const {i18n} = useTranslation()
    return (
        <ConfigProvider locale={i18n.language || DEFAULT_LANGUAGE}>
            <Provider store={store}>
                <App>
                    <PageContainer/>
                </App>
            </Provider>
        </ConfigProvider>
    )
};

export default MyApp;