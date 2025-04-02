import {Layout, Row} from "antd";
import {ReactNode, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {UserSchema} from "../../schemas/user/User.ts";
import {clearUserError, loadUser, selectUserError, selectUser} from "../../store/slices/user.ts";
import useApp from "antd/es/app/useApp";
import {BlockImage} from "../blocks/sidebar/BlockImage.tsx";
import {BlockInfo} from "../blocks/sidebar/BlockInfo.tsx";
import {BlockKeyQualities} from "../blocks/sidebar/BlockKeyQualities.tsx";
import {Sidebar, Content} from "../styled/Containers.ts";
import {BlockSkills} from "../blocks/sidebar/BlockSkills.tsx";
import {BlockLanguageSwitcher} from "../blocks/sidebar/BlockLanguageSwitcher.tsx";
import {useTranslation} from "react-i18next";
import {Loading} from "../styled/Loading.ts";
import {BlockProfile} from "../blocks/content/BlockProfile.tsx";
import {BlockExperience} from "../blocks/content/BlockExperience.tsx";
import {BlockEducation} from "../blocks/content/BlockEducation.tsx";
import {clearProjectError, selectProjectError} from "../../store/slices/project.ts";
import {BlockContacts} from "../blocks/sidebar/BlockContacts.tsx";
import {useAppDispatch} from "../../store/hooks.ts";

export const PageContainer = (): ReactNode => {
    const user: UserSchema = useSelector(selectUser)
    const errorMsg = useSelector(selectUserError)
    const projectErrorMsg = useSelector(selectProjectError)
    const {notification} = useApp()
    const {i18n, t} = useTranslation()
    const [opacity, setOpacity] = useState(1);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (errorMsg) {
            notification.error({
                message: t("User loading error"),
                description: errorMsg,
                duration: 5000,
                onClose: () => dispatch(clearUserError())
            })
        }
    }, [notification, errorMsg, dispatch, t]);

    useEffect(() => {
        if (projectErrorMsg) {
            notification.error({
                message: t("Project loading error"),
                description: projectErrorMsg,
                duration: 5000,
                onClose: () => dispatch(clearProjectError())
            })
        }
    }, [notification, projectErrorMsg, dispatch, t]);

    useEffect(() => {
        const load = async () => {
            setOpacity(0.4)
            await dispatch(loadUser(1))
            setOpacity(1)
        }
        load()
    }, [dispatch, i18n.language]);

    useEffect(() => {
        if (user) {
            document.title = `${user.firstName} ${user.lastName} - ${user.description}`
        }
    }, [user]);

    if (!user) {
        return (
            <Loading/>
        )
    }
    return (
        <>
            <Layout id={"pageContent"} style={{
                overflowX: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100vw"
            }}>
                <Layout.Content style={{
                    minHeight: "100vh",
                    width: "100%",
                    maxWidth: 1280,
                    opacity,
                    transition: "opacity .3s",
                    padding: 25
                }}>
                    <Row gutter={[16, 16]}>
                        <Sidebar xs={24} sm={24} md={8} lg={8}>
                            <BlockLanguageSwitcher/>
                            <BlockImage/>
                            <BlockInfo/>
                            <BlockContacts/>
                            <BlockSkills/>
                            <BlockKeyQualities/>
                        </Sidebar>
                        <Content xs={24} sm={24} md={16} lg={16}>
                            <BlockProfile/>
                            <BlockExperience/>
                            <BlockEducation/>
                        </Content>
                    </Row>
                </Layout.Content>
            </Layout>
        </>
    )
}
