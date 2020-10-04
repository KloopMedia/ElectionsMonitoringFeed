import React, {useState, useEffect} from 'react'
import NewsCard from './NewsCard'
import Grid from "@material-ui/core/Grid";
import TablePagination from "@material-ui/core/TablePagination";
import {List} from "immutable"

const rowsPP = 10;

const PaginatedNews = props => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(rowsPP);
    const [dataSlice, setDataSlice] = useState([]);

    const calculateSlice = (pageNumber, rowsPage, data) => {
        const iData = List(data)
        const numberOfPages = Math.floor(iData.size / rowsPage) + 1;
        console.log("numberOfPages", numberOfPages);
        const start = pageNumber * rowsPage;
        let end = iData.size
        if (pageNumber !== numberOfPages - 1) {
            end = (pageNumber + 1) * rowsPage;
        }
        console.log("Start", start);
        console.log("End", end);
        return data.slice(start, end)
    }

    const handleChangePage = (event, newPage) => {
        setDataSlice(calculateSlice(newPage, rowsPerPage, props.data));
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(event.target.value);
        setDataSlice(calculateSlice(0, event.target.value, props.data));
    };

    useEffect(() => {
        // Update the document title using the browser API
        setDataSlice(calculateSlice(0, rowsPP, props.data));
    }, [props.data]);


    const pagination = props.data.length > 0 && (
        <TablePagination
            justify="center"
            component="div"
            count={props.data.length}
            page={page}
            onChangePage={handleChangePage}
            rowsPerPage={rowsPerPage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
        />)


    return (
        <div>
            {pagination}
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{minHeight: '100vh'}}>

                <Grid item xs={12}>
                    <Grid container justify="center" direction='column' spacing={1}>
                        {
                            dataSlice.map(news => (
                                <Grid item>
                                    <NewsCard news={news[1]}></NewsCard>
                                </Grid>
                        ))}

                    </Grid>
                </Grid>

            </Grid>
            {pagination}
        </div>
    )

}

export default PaginatedNews;