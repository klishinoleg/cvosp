import styled from "styled-components";
import {Card} from "antd";

export const SidebarCardCenter = styled(Card)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
    width: 340px;
`

export const SidebarCardSB = styled(Card)`
    display: flex;
    flex-direction: column;
    align-items: space-between;
    width: 340px;
`

export const SidebarCardStart = styled(Card)`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 340px;
`