import {FC} from "react";
import {ContentCardStart} from "../../styled/ContentCard.ts";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {selectUser} from "../../../store/slices/user.ts";
import {TextMain} from "../../styled/Text.ts";
import {Divider, Flex, List} from "antd";
import {ProfileSchema} from "../../../schemas/user/Profile.ts";
import {ListItemSB} from "../../styled/ListItem.ts";
import {ImageProfile} from "../../styled/Images.ts";
import {Name} from "../../styled/Name.ts";
import {helperImageUrl} from "../../../helpers/helperImageUrl.ts";


interface ProfileItemProps {
    profile: ProfileSchema,
    key: string
}

const ProfileItem: FC<ProfileItemProps> = ({profile}) => {
    return (
        <ListItemSB>
            <Flex style={{alignItems: "center", gap: 5}}>
                <ImageProfile src={helperImageUrl(profile.icon)} alt={profile.name}/>
                <Name>{profile.name}</Name>
            </Flex>
            <TextMain>{profile.description} / {profile.year}</TextMain>
        </ListItemSB>
    )
}


export const BlockProfile: FC = () => {
    const {t} = useTranslation();
    const user = useSelector(selectUser)


    return (
        <ContentCardStart title={t("Profile")}>
            <TextMain>{user.text}</TextMain>
            <Divider/>
            <List>
                {user.profiles.map(profile => (
                    <ProfileItem profile={profile} key={`UserProfiles${profile.id}`}/>
                ))}
            </List>
        </ContentCardStart>
    )
}