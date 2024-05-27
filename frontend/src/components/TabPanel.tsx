import { Box, Typography } from "@mui/material";

export function TabPanel({ children, value, index, ...other }: any) {

    return value === index ? (
        children
    ) : <></>;


}