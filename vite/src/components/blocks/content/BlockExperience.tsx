import {ContentCardStart} from "../../styled/ContentCard.ts";
import {useTranslation} from "react-i18next";
import {JobSchema} from "../../../schemas/user/Job.ts";
import {FC} from "react";
import {ListItemWithCircle} from "../../styled/ListItem.ts";
import {Name, SubName} from "../../styled/Name.ts";
import {ListWithLeftLine} from "../../styled/Lists.ts";
import {useSelector} from "react-redux";
import {selectUser} from "../../../store/slices/user.ts";
import {TextMain} from "../../styled/Text.ts";
import {FlexColumn, FlexRow} from "../../styled/Divs.ts";
import {LinkIcon} from "../../elements/IconLink.tsx";
import {helperImageUrl} from "../../../helpers/helperImageUrl.ts";
import {ProjectListItem} from "../../items/ProjectItem.tsx";


interface ExperienceProps {
    job: JobSchema,
    key: string
}

const ExperienceItem: FC<ExperienceProps> = ({job}) => {
    return (
        <ListItemWithCircle>
            <FlexColumn>
                <TextMain>
                    {new Date(job.startDate).getFullYear()}
                    {job.endDate && (
                        <> - {new Date(job.endDate).getFullYear()}</>
                    )}
                </TextMain>
                <FlexRow>
                    <LinkIcon name={job.name} icon={helperImageUrl(job.icon)} site={job.site} showName={false}/>
                    <FlexColumn>
                        <Name>{job.profession}</Name>
                        <SubName>{job.name}</SubName>
                        <TextMain>{job.description}</TextMain>
                    </FlexColumn>
                </FlexRow>
                <FlexRow>
                    {job.projects.map(project => (
                        <ProjectListItem project={project} key={`projectListItem${project.id}`}/>
                    ))}
                </FlexRow>
            </FlexColumn>
        </ListItemWithCircle>
    )
}

export const BlockExperience = () => {
    const {t} = useTranslation()
    const user = useSelector(selectUser)
    return (
        <ContentCardStart title={t("Experience")}>
            <ListWithLeftLine>
                {user.jobs.map(job => (
                    <ExperienceItem job={job} key={`jobItem${job.id}`}/>
                ))}
            </ListWithLeftLine>
        </ContentCardStart>
    )
}