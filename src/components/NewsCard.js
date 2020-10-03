import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import ReportIcon from '@material-ui/icons/Report';
import DriveEtaIcon from '@material-ui/icons/DriveEta';

import AlarmIcon from '@material-ui/icons/Alarm';
import Brightness5Icon from '@material-ui/icons/Brightness5';
import Brightness3Icon from '@material-ui/icons/Brightness3';

import LocationOnIcon from '@material-ui/icons/LocationOn';
import LocationOffIcon from '@material-ui/icons/LocationOff';
import HomeIcon from '@material-ui/icons/Home';

import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: '#2E3B55',
    width: theme.spacing(7),
    height: theme.spacing(7)
  },

}));

export default function NewsCard(props) {

  //console.log(props)

  let isFile = false
  let isImage = false
  let isVideo = false
  let isSms = props.news.isSms

  if (Object.keys(props.news.fileInfo).length > 0){

    isFile = true

    isImage = props.news.fileInfo.isImage
    isVideo = props.news.fileInfo.isVideo
  }

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const createParagraph = (text, index) => {

    let splittedText = text.split('ответ: ')
    let primaryText = splittedText[0]
    let answerText = splittedText[1]

    if (index==0){
      return(
        <Typography variant="body1" color="textPrimary"><b>{text}</b></Typography>
      );
    }else{
      return(
        <Typography variant="body1" color="textPrimary">{primaryText}
          <Typography variant="subtitle1" color="secondary">{answerText}</Typography> 
        </Typography>    
      );
    }
    
  }

  const descriptionLastIndex = props.news.description.length - 1

  const createDescriptionParagraph = (text, index) => {

    let splittedText = text.split('ответ: ')
    let primaryText = splittedText[0]
    let answerText = splittedText[1]

    if (index==descriptionLastIndex){
      return(
        <Typography variant="body2" color="textSecondary" component="p">{primaryText}
          <Typography variant="subtitle1" color="secondary">{answerText}</Typography> 
        </Typography>
      );
    }else{
      return(
        <Typography variant="body2" color="textSecondary" component="p"><b>{text}</b></Typography>
      );
    }
    
  }

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" variant="rounded" className={classes.avatar}>
            {props.news.pollingStation}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={props.news.title}
        subheader={props.news.date}
      />
      {isImage ? <CardMedia
        className={classes.media}
        image={props.news.fileInfo.public_url}
        title={props.news.fileInfo.filename}
      />
        : <div></div>
      }
      {isVideo ? <CardMedia 
        component='iframe'
        title={props.news.fileInfo.filename}
        //src='https://www.youtube.com/embed/FEG31rDg2TU'
        src={props.news.fileInfo.public_url}
        />
        : <div></div>
      }
      <CardContent>
        {isSms ? <Typography variant="h5" align="center" color="secondary" component="p">SMS!!!</Typography> : <div></div>}

        <Typography variant="body2" color="textSecondary" component="p">
          {Object.keys(props.news.description).map(index => ( 
            createDescriptionParagraph(props.news.description[index], index)            
          ))}
        </Typography>
      </CardContent>
      <CardActions disableSpacing={true}> 
        <IconButton aria-label="Emergency">
          <ReportIcon color={props.news.formEmergency ? "error":"disabled"}/>       
        </IconButton>
        <IconButton aria-label="Mobile">
          <DriveEtaIcon color={props.news.formMobile ? "error":"disabled"}/>         
        </IconButton>
        <IconButton aria-label="PeriodOfDays">      
          <AlarmIcon color={props.news.formMorning ? "error":"disabled"}/>
          <Brightness5Icon color={props.news.formAfternoon ? "error":"disabled"}/>
          <Brightness3Icon color={props.news.formEvening ? "error":"disabled"}/>
        </IconButton>
        <IconButton aria-label="CheckHome">          
          <LocationOnIcon color={props.news.formEnter ? "error":"disabled"}/>
          <LocationOffIcon color={props.news.formExit ? "error":"disabled"}/>
          <HomeIcon color={props.news.formHome ? "error":"disabled"}/>
        </IconButton>
        {!isFile ? <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
        : <div></div>
      }
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>          

          {Object.keys(props.news.violations).map(index => (
              Object.keys(props.news.violations[index]).map(indexInner => (  

                createParagraph(props.news.violations[index][indexInner], indexInner)
            
              ))

            ))}     

        </CardContent>
      </Collapse>
    </Card>
  );
}
