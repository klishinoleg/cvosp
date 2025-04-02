import styled from "styled-components";
import Item from "antd/es/list/Item";

export const ListItemColumn = styled(Item)`
    display: flex;
    flex-direction: column;
    align-items: flex-start !important;
    text-align: left;
`

export const ListItemSB = styled(Item)`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

export const ListItemWithCircle = styled(ListItemSB)`
    position: relative;

    &::before {
        content: "";
        position: absolute;
        left: -27px;
        top: 23px;
        width: 12px;
        height: 12px;
        border: 1px solid #a1a1a1;
        border-radius: 50%;
        background-color: #fff;
        transform: translateY(-50%);
    }
`;