import React from 'react'
import NewsCard from './NewsCard'

import Grid from "@material-ui/core/Grid";

const sortProperties = (obj, sortedBy, isNumericSort, reverse) => {
    sortedBy = sortedBy || 1; // by default first key
    isNumericSort = isNumericSort || false; // by default text sort
    reverse = reverse || false; // by default no reverse

    var reversed = (reverse) ? -1 : 1;

    var sortable = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            sortable.push([key, obj[key]]);
        }
    }
    if (isNumericSort)
        sortable.sort(function (a, b) {
            return reversed * (a[1][sortedBy] - b[1][sortedBy]);
        });
    else
        sortable.sort(function (a, b) {
            var x = a[1][sortedBy],
                y = b[1][sortedBy];
            return x < y ? reversed * -1 : x > y ? reversed : 0;
        });
    return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}

const News = (props) => {   

    let sortedNews = sortProperties(props.news, 'timestamp', true, true)

    console.log('COMPARE')
    console.log(props.news)
    console.log(sortedNews)

    console.log(sortedNews[0][1])

    return (


        
        //     sortedNews.map(news => (
        //         <NewsCard news={news[1]}></NewsCard>
        // ))
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '100vh' }}
            >

            <Grid item xs={12}>
                {
                    sortedNews.map(news => (
                        <NewsCard news={news[1]}></NewsCard>
                ))}
                {/* {Object.keys(props.news).map(news => (
                    <NewsCard news={props.news[news]}></NewsCard>
                ))} */}

            </Grid>   

        </Grid> 
        
    )
}
const areEqual = (prevProps, nextProps) => {
    return (prevProps.news === nextProps.news)
}
  
export default React.memo(News, areEqual); 