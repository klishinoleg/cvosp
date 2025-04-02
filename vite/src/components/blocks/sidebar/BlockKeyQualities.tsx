import {FC} from "react";
import {List} from "antd";
import {selectUser} from "../../../store/slices/user.ts";
import {useSelector} from "react-redux";
import {UserSchema} from "../../../schemas/user/User.ts";
import {KeyQualitySchema} from "../../../schemas/user/KeyQuality.ts";
import {CheckOutlined} from "@ant-design/icons";
import {SidebarCardStart} from "../../styled/SidebarCard.ts";
import {ListItemColumn} from "../../styled/ListItem.ts";
import {Name} from "../../styled/Name.ts";
import {Description} from "../../styled/Description.ts";


interface KeyQualityItemProps {
    kq: KeyQualitySchema;
    key: string
}

const KeyQualityItem: FC<KeyQualityItemProps> = ({kq}) => {
    return (
        <ListItemColumn>
            <Name><CheckOutlined/> {kq.name}</Name>
            <Description>{kq.description}</Description>
        </ListItemColumn>
    )
};
export const BlockKeyQualities: FC = () => {
    const user: UserSchema = useSelector(selectUser)
    return (
        <SidebarCardStart>
            <List>
                {user.keyQualities.map(kq => (
                    <KeyQualityItem kq={kq} key={`kq${kq.id}`}/>
                ))}
            </List>
        </SidebarCardStart>
    )
}
