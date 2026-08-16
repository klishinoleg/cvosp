import {FC} from "react";
import {Provider} from "react-redux"
import {store} from "./store/store.ts";
import {PageContainer} from "./components/containers/PageContainer.tsx";


const MyApp: FC = () => {
    return (
        <Provider store={store}>
            <PageContainer/>
        </Provider>
    )
};

export default MyApp;
