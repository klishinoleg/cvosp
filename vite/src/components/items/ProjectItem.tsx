import {ProjectListSchema, ProjectSchema} from "../../schemas/project/Project.ts";
import {FC, useEffect, useState} from "react";
import {helperImageUrl} from "../../helpers/helperImageUrl.ts";
import {ImageIconProject} from "../styled/Images.ts";
import {Button, Divider, Flex, Image, Modal, Tag} from "antd";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {clearProject, loadProject, selectProject} from "../../store/slices/project.ts";
import {TextMain} from "../styled/Text.ts";
import {FlexColumn, FlexRow} from "../styled/Divs.ts";
import {CheckOutlined, GlobalOutlined} from "@ant-design/icons";
import {useAppDispatch} from "../../store/hooks.ts";

export interface ProjectListItemProps {
    project: ProjectListSchema,
    key: string
}


export const ProjectListItem: FC<ProjectListItemProps> = ({project}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const dispatch = useAppDispatch()
    const projectData: ProjectSchema = useSelector(selectProject)
    const {t} = useTranslation()

    useEffect(() => {
        const load = async () => {
            if (isOpen) {
                setLoading(true);
                const data = await dispatch(loadProject(project.id)) as {payload: ProjectSchema | null}
                if (data.payload?.id) {
                    setLoading(false)
                }
            } else {
                dispatch(clearProject())
            }
        }
        load()
    }, [isOpen, project, dispatch]);

    return (
        <>
            <ImageIconProject src={helperImageUrl(project.thumb)} alt={project.name} onClick={() => setIsOpen(true)}/>
            {isOpen && (
                <Modal
                    title={(
                        <FlexRow style={{alignItems: "center"}}>
                            <ImageIconProject src={helperImageUrl(projectData?.icon)}/>
                            <h2>{projectData?.name}</h2>
                        </FlexRow>
                    )}
                    width={1024}
                    open={isOpen}
                    footer={(
                        <FlexRow style={{justifyContent: "center"}}>
                            <Button type="primary" onClick={() => setIsOpen(false)}>
                                {t("Ok")}
                            </Button>
                        </FlexRow>
                    )}
                    loading={loading}
                    onCancel={() => setIsOpen(false)}
                >
                    {!loading && projectData && (
                        <FlexColumn style={{gap: 20}}>
                            <Flex gap="4px 0" wrap>
                                {projectData.site && (
                                    <Tag color={"blue"} icon={<GlobalOutlined/>}>
                                        <a href={projectData.site} target={"_blank"}>{projectData.site}</a>
                                    </Tag>
                                )}
                                {projectData.skills.map(skill => (
                                    <Tag color={"success"} icon={<CheckOutlined/>}
                                         key={`projectsSkillsItem${skill.id}`}>
                                        {skill.name}
                                    </Tag>
                                ))}
                            </Flex>
                            <TextMain>{projectData.description}</TextMain>
                            <Flex wrap style={{justifyContent: "space-between"}}>
                                <Image.PreviewGroup>
                                    {projectData.images.map(image => (
                                        <Image width={300} height={250} src={helperImageUrl(image.thumbnail)}
                                               style={{borderRadius: 5}}
                                               preview={{
                                                   src: helperImageUrl(image.image),
                                               }}
                                        />

                                    ))}
                                </Image.PreviewGroup>
                            </Flex>
                            <Divider/>
                        </FlexColumn>
                    )}
                </Modal>
            )}
        </>
    )
}