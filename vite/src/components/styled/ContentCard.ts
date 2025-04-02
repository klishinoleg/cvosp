import styled from "styled-components";
import {Card} from "antd";

export const ContentCardCenter = styled(Card)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
    width: 100%;
`

export const ContentCardSB = styled(Card)`
    display: flex;
    flex-direction: column;
    align-items: space-between;
    width: 100%;
`

export const ContentCardStart = styled(Card)`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
`