import {ContentCardStart} from "../../styled/ContentCard.ts";
import {useTranslation} from "react-i18next";
import {EducationSchema} from "../../../schemas/user/Education.ts";
import {UserSchema} from "../../../schemas/user/User.ts";
import {useSelector} from "react-redux";
import {selectUser} from "../../../store/slices/user.ts";
import {FC, useMemo} from "react";
import {ListWithLeftLine} from "../../styled/Lists.ts";
import {ListItemWithCircle} from "../../styled/ListItem.ts";
import {TextMain} from "../../styled/Text.ts";
import {FlexColumn, FlexRow} from "../../styled/Divs.ts";
import {LinkIcon} from "../../elements/IconLink.tsx";
import {Name} from "../../styled/Name.ts";
import {helperImageUrl} from "../../../helpers/helperImageUrl.ts";


interface EducationServicesGroup {
    name: string;
    site?: string;
    icon?: string;
    educations: EducationSchema[];
    key?: string;
}

interface EducationYearsGroup {
    yearRange: string;
    services: EducationServicesGroup[];
}

interface YearGroupProps {
    yearsGroup: EducationYearsGroup;
    key?: string;
}

interface ServicesGroupProps {
    serviceGroup: EducationServicesGroup;
    key?: string;
}

interface EducationProps {
    education: EducationSchema;
    key?: string;
}

const Education: FC<EducationProps> = ({education}) => {
    return (
        <FlexColumn>
            <Name>{education.profession}</Name>
            <TextMain>{education.description}</TextMain>
        </FlexColumn>
    )
}

const ServiceGroup: FC<ServicesGroupProps> = ({serviceGroup}) => {
    return (
        <FlexRow>
            <LinkIcon name={serviceGroup.name} icon={helperImageUrl(serviceGroup.icon)} site={serviceGroup.site} showName={true}/>
            <FlexColumn>
                {serviceGroup.educations.map(education => (
                    <Education education={education} key={`education${education.id}`}/>
                ))}
            </FlexColumn>
        </FlexRow>
    )
}

const YearGroup: FC<YearGroupProps> = ({yearsGroup}) => {
    return (
        <ListItemWithCircle>
            <FlexColumn>
                <TextMain>{yearsGroup.yearRange}</TextMain>
                {yearsGroup.services.map(service => (
                    <ServiceGroup serviceGroup={service}
                                  key={`serviceYaer${yearsGroup.yearRange}service${service.name}`}/>
                ))}
            </FlexColumn>
        </ListItemWithCircle>
    )
}

export const BlockEducation = () => {
    const {t} = useTranslation()
    const user: UserSchema = useSelector(selectUser)

    const groupedYears: EducationYearsGroup[] = useMemo(() => Object.values(
        user.educations.reduce((acc, education) => {
            const startYear = new Date(education.startDate).getFullYear();
            const endYear = education.endDate ? new Date(education.endDate).getFullYear() : startYear;
            const yearRange = startYear === endYear ? `${startYear}` : `${startYear} - ${endYear}`;

            if (!acc[yearRange]) acc[yearRange] = {yearRange, services: []};

            let serviceGroup = acc[yearRange].services.find(s => s.name === education.name.trim());
            if (!serviceGroup) {
                serviceGroup = {
                    name: education.name.trim(),
                    site: education.site,
                    icon: education.icon,
                    educations: []
                };
                acc[yearRange].services.push(serviceGroup);
            }
            serviceGroup.educations.push(
                Object.fromEntries(
                    Object.entries(education)
                        .filter(([k]) => ["icon", "site"].indexOf(k) === -1)) as EducationSchema);

            return acc;
        }, {} as Record<string, EducationYearsGroup>)
    ), [user.educations])

    return (
        <ContentCardStart title={t("Education")}>
            <ListWithLeftLine>
                {groupedYears.map(yearsGroup => (
                    <YearGroup key={`${yearsGroup.yearRange}`} yearsGroup={yearsGroup}/>
                ))}
            </ListWithLeftLine>
        </ContentCardStart>
    )
}