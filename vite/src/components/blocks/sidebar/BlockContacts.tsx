import {FC} from "react";
import {Button, List} from "antd";
import {useSelector} from "react-redux";
import {selectUser} from "../../../store/slices/user.ts";
import {SidebarCardSB} from "../../styled/SidebarCard.ts";
import {TableLisItem} from "../../styled/TableListItem.ts";
import {useTranslation} from "react-i18next";
import {ImageIconContact} from "../../styled/Images.ts";
import {helperImageUrl} from "../../../helpers/helperImageUrl.ts";

export const BlockContacts: FC = () => {
    const user = useSelector(selectUser)
    const {t} = useTranslation()
    return (
        <SidebarCardSB title={t("Contacts")}>
            <List>
                {user.contacts.map(contact => (
                    <TableLisItem key={`contactsItem${contact.id}`}>
                        <ImageIconContact src={helperImageUrl(contact.contactInfo.icon)}/>
                        <Button href={contact.link} target="_blank" rel="noopener noreferrer">{contact.title}</Button>
                    </TableLisItem>
                ))}
            </List>
        </SidebarCardSB>
    )
}

