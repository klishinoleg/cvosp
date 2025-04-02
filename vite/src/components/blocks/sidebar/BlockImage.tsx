import {FC} from "react";
import {Image} from "antd";
import {useSelector} from "react-redux";
import {selectUser} from "../../../store/slices/user.ts";
import {SidebarCardCenter} from "../../styled/SidebarCard.ts";
import {H1, H2} from "../../styled/Headers.ts";
import {helperImageUrl} from "../../../helpers/helperImageUrl.ts";


export const BlockImage: FC = () => {
    const user = useSelector(selectUser);
    return (
        <SidebarCardCenter>
            {user.picture && (
                <Image width={200} height={200} src={helperImageUrl(user.thumbnail)} style={{borderRadius: 5}}
                       preview={{
                           src: helperImageUrl(user.picture),
                       }}
                />
            )}
            <H1 level={3}>{user.firstName} {user.lastName}</H1>
            <H2 level={4}>{user.description}</H2>
        </SidebarCardCenter>
    )
}