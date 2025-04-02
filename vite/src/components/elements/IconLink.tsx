import {FC, ReactNode} from "react";
import {ImageIcon100} from "../styled/Images.ts";
import {FlexColumn} from "../styled/Divs.ts";
import {LinkStyled} from "../styled/Link.ts";
import styled from "styled-components";

interface LinkIconProps {
    icon?: string;
    site?: string;
    name: string;
    showName: boolean
}

export const LinkIcon: FC<LinkIconProps> = ({icon, site, name, showName}) => {

    const Wrapper = ({children}: {children: ReactNode | string}) => {
        if (site) {
            return (
                <LinkStyled target={"_blank"} href={site}>{children}</LinkStyled>
            )
        }
        return children;
    }

    return (
        <Col>
            {icon && (
                <Wrapper><ImageIcon100 src={icon} alt={name}/></Wrapper>
            )}
            {site && showName && (
                <Wrapper>{name}</Wrapper>
            )}
        </Col>
    )
}

const Col = styled(FlexColumn)`
    align-items: center;
    text-align: center;
    max-width: 110px;
`