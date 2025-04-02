import {FC} from "react";
import {selectUser} from "../../../store/slices/user.ts";
import {useSelector} from "react-redux";
import {UserSchema} from "../../../schemas/user/User.ts";
import {SidebarCardCenter} from "../../styled/SidebarCard.ts";
import {Name} from "../../styled/Name.ts";
import {ListItemSB} from "../../styled/ListItem.ts";
import {UserSkillSchema} from "../../../schemas/skill/UserSkill.ts";
import {Divider, Progress} from "antd";
import {useTranslation} from "react-i18next";

interface SkillItemProps {
    skill: UserSkillSchema;
    key: string
}

interface GroupProps {
    skills: UserSkillSchema[]
    showDivider: boolean
    key: string
}

const SkillItem: FC<SkillItemProps> = ({skill}) => {
    return (
        <ListItemSB style={{width: 300}}>
            <Name style={{flex: 5}}>{skill.skill.name}</Name>
            <Progress
                strokeColor={{from: '#bb9944', to: '#77f138'}}
                style={{flex: 7}}
                size={[200, 12]}
                percent={skill.competitionLevel} showInfo={false}/>
        </ListItemSB>
    )
};

const GroupItem: FC<GroupProps> = ({skills, showDivider}) => {
    return (
        <>
            {showDivider && (
                <Divider/>
            )}
            {skills.map(skill => (
                <SkillItem skill={skill} key={`skillItem${skill.id}`}/>
            ))}
        </>
    )
}

export const BlockSkills: FC = () => {
    const {t} = useTranslation()
    const user: UserSchema = useSelector(selectUser)
    const groupedSkills: Record<number, UserSkillSchema[]> = user.skills.reduce((acc, skill) => {
        acc[skill.group] = acc[skill.group] || [];
        acc[skill.group].push(skill);
        return acc;
    }, {} as Record<number, UserSkillSchema[]>);

    return (
        <SidebarCardCenter title={t("Skills")}>
            {Object.entries(groupedSkills).map(([group, skills], index) => (
                <GroupItem
                    skills={skills}
                    showDivider={index > 0}
                    key={`groupItem${group}`}
                />
            ))}
        </SidebarCardCenter>
    );
}





