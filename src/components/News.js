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

    console.log(props)
    console.log('SORTED')
    console.log(sortedNews)

    //FILTERING

    //violations
    sortedNews = sortedNews.filter(function (el) {
        if(props.filters.filterViolation != 'Любое нарушение'){
            
            let show = false
            console.log("DEBUG")
            el[1].description.map(description => {
                console.log(props.filters.filterViolation)
                if ((description == props.filters.filterViolation) || 
                    (description == props.filters.filterViolation + ' (см. фото)') || 
                    (description == props.filters.filterViolation + ' (см. видео)')
                    ){

                    show = true
                }
            })
            return show
        } 
        else{
            return true
        }        
    });

    //poolingStation
    sortedNews = sortedNews.filter(function (el) {
        if(props.filters.searchPoolingStation != 0){
            return el[1].pollingStation == props.filters.searchPoolingStation.toString();
        } 
        else{
            return true
        }        
    });

    //switchText
    sortedNews = sortedNews.filter(function (el) {
        if (Object.keys(el[1].fileInfo).length == 0) {
            if(props.filters.switchText){
                return true;
            }else{
                return false
            }  
        }else{
            return true
        }          
    });

    //switchEmergency
    sortedNews = sortedNews.filter(function (el) {
        if (el[1].formEmergency) {
            if(props.filters.switchEmergency){
                return true;
            }else{
                return false
            }  
        }else{
            return true
        }          
    });

     //switchMobile
     sortedNews = sortedNews.filter(function (el) {
        if (el[1].formMobile) {
            if(props.filters.switchMobile){
                return true;
            }else{
                return false
            }  
        }else{
            return true
        } 
    });

    //switchMorning
    sortedNews = sortedNews.filter(function (el) {
        if (el[1].formMorning) {
            if(props.filters.switchMorning){
                return true;
            }else{
                return false
            }  
        }else{
            return true
        }   
    });

    //switchAfternoon
    sortedNews = sortedNews.filter(function (el) {
        if (el[1].formAfternoon) {
            if(props.filters.switchAfternoon){
                return true;
            }else{
                return false
            }  
        }else{
            return true
        }     
    });

    //switchEvening
    sortedNews = sortedNews.filter(function (el) {
        if (el[1].formEvening) {
            if(props.filters.switchEvening){
                return true;
            }else{
                return false
            }  
        }else{
            return true
        }       
    });

     //switchEnter
     sortedNews = sortedNews.filter(function (el) {
        if (el[1].formEnter) {
            if(props.filters.switchEnter){
                return true;
            }else{
                return false
            }  
        }else{
            return true
        }     
    });

    //switchExit
    sortedNews = sortedNews.filter(function (el) {
        if (el[1].formExit) {
            if(props.filters.switchExit){
                return true;
            }else{
                return false
            }  
        }else{
            return true
        }       
    });

    //switchHome
    sortedNews = sortedNews.filter(function (el) {
        if (el[1].formHome) {
            if(props.filters.switchHome){
                return true;
            }else{
                return false
            }  
        }else{
            return true
        }     
    });


    //switchImage
    sortedNews = sortedNews.filter(function (el) {
        if (Object.keys(el[1].fileInfo).length > 0 && el[1].fileInfo.isImage) {
            if(props.filters.switchImage){
                return true;
            }else{
                return false
            }  
        }else{
            return true
        }          
    });

    //switchVideo
    sortedNews = sortedNews.filter(function (el) {
        if (Object.keys(el[1].fileInfo).length > 0 && el[1].fileInfo.isVideo) {
            if(props.filters.switchVideo){
                return true;
            }else{
                return false
            }  
        }else{
            return true
        }          
    });    

    //dontShow
    sortedNews = sortedNews.filter(function (el) {
        return !el[1].dontShow
    }); 

    console.log(sortedNews)

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
                <Grid container justify="center" direction='column' spacing={1}>
                {                
                    sortedNews.map(news => (
                        <Grid item>
                            <NewsCard news={news[1]}></NewsCard>
                        </Grid>                        
                ))}
                {/* {Object.keys(props.news).map(news => (
                    <NewsCard news={props.news[news]}></NewsCard>
                ))} */}
                  </Grid> 
            </Grid>   

        </Grid> 
        
    )
}
const areEqual = (prevProps, nextProps) => {
    return ((prevProps.news === nextProps.news) && (prevProps.filters===nextProps.filters))
}
  
export default React.memo(News, areEqual); 