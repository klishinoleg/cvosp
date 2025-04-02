import {FC} from "react";
import {List, Typography} from "antd";
import {
    GiftOutlined, HomeOutlined,
    ManOutlined,
    QuestionOutlined,
    SmileOutlined,
    TeamOutlined,
    WomanOutlined
} from "@ant-design/icons";
import {GenderEnum} from "../../../constanst/enums/gender.ts";
import {useSelector} from "react-redux";
import {selectUser} from "../../../store/slices/user.ts";
import {SidebarCardSB} from "../../styled/SidebarCard.ts";
import {TableLisItem} from "../../styled/TableListItem.ts";
import {useTranslation} from "react-i18next";

const {Text} = Typography;

export const BlockInfo: FC = () => {
    const user = useSelector(selectUser)
    const bd = user.birthday ? new Date(user.birthday) : null
    const y = bd ? new Date((new Date().getTime() - bd.getTime())).getUTCFullYear() - 1970 : null
    const {t} = useTranslation()
    return (
        <SidebarCardSB>
            <List>
                <TableLisItem>
                    <HomeOutlined/>
                    <Text>{user.location}</Text>
                </TableLisItem>
                {bd && (
                    <TableLisItem>
                        <GiftOutlined/>
                        <Text>{bd.toLocaleDateString()} / {y}</Text>
                    </TableLisItem>
                )}
                <TableLisItem>
                    <TeamOutlined/>
                    <Text>{user.married ? t(`Married${user.gender}`) : `NotMarried${user.gender}`}</Text>
                </TableLisItem>
                {user.gender && (
                    <TableLisItem>
                        {user.gender === GenderEnum.MALE ? (<ManOutlined/>) : user.gender === GenderEnum.FEMALE ? (
                            <WomanOutlined/>) : (<QuestionOutlined/>)}
                        <Text>{t(user.gender)}</Text>
                    </TableLisItem>
                )}
                {user.childrenDesc && (
                    <TableLisItem>
                        <SmileOutlined/>
                        <Text>{user.childrenDesc}</Text>
                    </TableLisItem>
                )}
            </List>
        </SidebarCardSB>
    )
}

