import React from 'react';
import News from './components/News'

import firebase from './firebase';
import matchTitle from './utils/titleMathcing'
import TopPanel from './components/TopPanel'

import CircularProgress from '@material-ui/core/CircularProgress';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Grid from "@material-ui/core/Grid";
import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import NativeSelect from '@material-ui/core/NativeSelect';

import violationsList from './utils/violationsList'

import TopPoolingStations from './components/TopPoolingStations'

const db = firebase.firestore()

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      news : {},  

      filters : {
        switchEmergency : true,
        switchMobile : true,
        switchMorning : false,
        switchAfternoon : true,
        switchEvening : true,
        switchEnter : false,
        switchExit : true,
        switchHome : true,
        switchText : true,
        switchImage : true,
        switchVideo : true,
        
        searchPoolingStation : 0,
        searchDistrict : '',

        filterViolation : 'Любое нарушение'
      },

      switchEmergency : true,
      switchMobile : true,
      switchMorning : false,
      switchAfternoon : true,
      switchEvening : true,
      switchEnter : false,
      switchExit : true,
      switchHome : true,
      switchText : true,
      switchImage : true,
      switchVideo : true,

      filterViolation : 'Любое нарушение',

      showSpinner: true     

    };   

    this.jsonForms = {}
    this.news = {}   
    this.searchPoolingStation = 0 
    this.searchDistrict = 0
    this.violationList = []  
  }    

  //Костыль чтобы не делать мульон запросов!
  loadJsonForms = () => {

    const formUrls = [
      'https://raw.githubusercontent.com/KloopMedia/ElectionsMonitoringFormsConfig/master/final_form_emergency.json',      
      'https://raw.githubusercontent.com/KloopMedia/ElectionsMonitoringFormsConfig/master/final_form_mobile.json',
      'https://raw.githubusercontent.com/KloopMedia/ElectionsMonitoringFormsConfig/master/final_form_morning.json',
      'https://raw.githubusercontent.com/KloopMedia/ElectionsMonitoringFormsConfig/master/final_form_afternoon.json',
      'https://raw.githubusercontent.com/KloopMedia/ElectionsMonitoringFormsConfig/master/final_form_evening.json', 
      'https://raw.githubusercontent.com/KloopMedia/ElectionsMonitoringFormsConfig/master/final_form_enter.json',
      'https://raw.githubusercontent.com/KloopMedia/ElectionsMonitoringFormsConfig/master/final_form_exit.json',
      'https://raw.githubusercontent.com/KloopMedia/ElectionsMonitoringFormsConfig/master/final_form_home.json'
            
    ]

    formUrls.forEach((url) => {
      fetch(url)
      .then(response => response.json())
      .then((formData) => {
        this.jsonForms[url] = formData             
      })
      .catch((error) => {
        console.error(error)
      })          
    })
  }

  generateListOfFilterViolations = () => {
    
    let violationsArray = []
    Object.entries(violationsList).forEach(([key, title]) => {
      violationsArray.push(title)
    });

    this.violationList = [...new Set(violationsArray)];
  }

  generateNewsData = (feedData, formData) => {   
    
    //console.log(feedData)

    let report = {}
    let violations = []
    let description = []
    let fileInfo = {}

    let dontShow = false

    //Если файл
    if(feedData.hasOwnProperty('fileId')){
      
      if (feedData['filename'] === null || feedData['filename'] === undefined ){
        console.log('ERROR: NO FILENAME')

        return
      }

      report['title'] = feedData['district']
      report['date'] = new Date(feedData['date'].seconds*1000).toString();
      report['timestamp'] = feedData['date'].seconds
      report['pollingStation'] = feedData['polling_station']
      report['district'] = feedData['district']

      fileInfo['public_url'] = feedData['public_url']
      fileInfo['filename'] = feedData['filename']

      const imgExt = ['jpg', 'jpeg', 'png']
      const vidExt = ['mp4', 'm4a', 'm4v', 'f4v', 'f4a', 'm4b', 'm4r', 'f4b', 'mov', '3gp', '3gp2', '3g2', '3gpp', '3gpp2', 'ogg', 'oga', 'ogv', 'ogx', 'wmv', 'wma', 'webm', 'flv', 'avi', 'mkv', 'ts']

      if (imgExt.includes(feedData['filename'].split(".").slice(-1)[0]))
      {
        fileInfo['isImage'] = true 
        description.push(matchTitle(formData['questions'][Number(feedData['answer_number'])].title) + ' (см. фото)') 
        
        if (feedData['answer_subnumber'] !== null && feedData['answer_subnumber'] !== undefined ) 
        {
          const subquestions = formData['questions'][Number(feedData['answer_number'])]['subquestion'] 

          let subAnswerId = Number(subquestions[Number(feedData['answer_subnumber'])]['on']) 
          let fileAnswers = formData['questions'][Number(feedData['answer_number'])]['answer']

          description.push(subquestions[Number(feedData['answer_subnumber'])]['q'] + ' ответ: ' + fileAnswers[subAnswerId] )
        }
        
      } 
      else{
        fileInfo['isImage'] = false 
      }

      if ((vidExt.includes(feedData['filename'].split(".").slice(-1)[0])))
      {
        fileInfo['isVideo'] = true
        description.push(matchTitle(formData['questions'][Number(feedData['answer_number'])].title) + ' (см. видео)')  

        if (feedData['answer_subnumber'] !== null && feedData['answer_subnumber'] !== undefined ) 
        {
          const subquestions = formData['questions'][Number(feedData['answer_number'])]['subquestion'] 

          let subAnswerId = Number(subquestions[Number(feedData['answer_subnumber'])]['on']) 
          let fileAnswers = formData['questions'][Number(feedData['answer_number'])]['answer']
          
          description.push(subquestions[Number(feedData['answer_subnumber'])]['q'] + ' ответ: ' + fileAnswers[subAnswerId] )
        }
      }
      else{
        fileInfo['isVideo'] = false
      }

      //КОСТЫЛЬ ЧТОБЫ НЕ ОТОБРАЖАТЬ doc, pdf e.t.c
      if(!fileInfo['isImage'] && !fileInfo['isVideo']){
        dontShow = true
      }

      //SMS
      let isSms = false
      if(feedData.hasOwnProperty('sms')){
        isSms = feedData['sms']
      }

      report['violations'] = violations     
      report['description'] = description  
      report['fileInfo'] = fileInfo

      //Form buttons
      report['formEmergency'] = formData['identifier'] == 'form_emergency'
      report['formMobile'] = formData['identifier'] == 'form_mobile'
      report['formMorning'] = formData['identifier'] == 'form_morning'
      report['formAfternoon'] = formData['identifier'] == 'form_afternoon'
      report['formEvening'] = formData['identifier'] == 'form_evening'
      report['formEnter'] = formData['identifier'] == 'form_enter'
      report['formExit'] = formData['identifier'] == 'form_exit'
      report['formHome'] = formData['identifier'] == 'form_home'

      report['isSms'] = isSms
      report['dontShow'] = dontShow

      this.news[feedData['fileId']] = report         

    //Если форма
    } else {

      //TODO
      report['title'] = feedData['district']
      report['date'] = new Date(feedData['timestamp'].seconds*1000).toString();
      report['timestamp'] = feedData['timestamp'].seconds
      report['district'] = feedData['district']

      if (formData['identifier']=='form_mobile'){
        report['pollingStation'] = feedData['answers'][0]

      }else{
        report['pollingStation'] = feedData['polling_station']
      }

      Object.entries(feedData['answers']).forEach(([keyAnswer, answer]) => {

        if (answer === null || answer === undefined ){
          console.log('ERROR')
          return
        }
        //console.log(`${keyAnswer} ${answer}`)
        let violation = []

        if (formData['questions'][keyAnswer]['type'] == 'multiradio'){
          let title = formData['questions'][keyAnswer]['title']              
          //console.log(title)  
          
          violation.push(title.slice(3))  
          description.push(matchTitle(title))               

          const subquestions = formData['questions'][keyAnswer]['subquestion'] 
          //console.log(subquestions)

          const answers = formData['questions'][keyAnswer]['answer'] 

          let counter = 1
          let violationCounter = 0
          Object.entries(answer).forEach(([keyQ, answerQ]) => {           
          
            //Выводить только если отличается от вопроса по умолчанию?
            if(answerQ.toString() == subquestions[keyQ]['on'])
            {
              let generatedAnswer = counter.toString() + '. ' + subquestions[keyQ]['q'] + ' ответ: ' + answers[answerQ]
              violation.push(generatedAnswer)
              violationCounter += 1

              counter += 1
            }
            
          });

          //ложная тревога
          if(violationCounter == 0){
            violation.pop()
          }

          violations.push(violation)

        } else if (formData['questions'][keyAnswer]['type'] == 'input' || formData['questions'][keyAnswer]['type'] == 'time'){
          
          let title = formData['questions'][keyAnswer]['title']              
          //console.log(title)  
          
          violation.push(title.slice(3))  
          description.push(matchTitle(title))    

          violation.push(answer)

          violations.push(violation)

        } else if (formData['questions'][keyAnswer]['type'] == 'radio'){
          
          let title = formData['questions'][keyAnswer]['title']              
          //console.log(title)  
          
          violation.push(title.slice(3))  
          description.push(matchTitle(title))    

          const answers = formData['questions'][keyAnswer]['answer']
          violation.push(answers[answer])

          violations.push(violation)          
        }       
        
      });


      //SMS
      let isSms = false
      if(feedData.hasOwnProperty('sms')){
        isSms = feedData['sms']
      }

      description.push('(разверните пост для детального просмотра)')

      report['violations'] = violations     
      report['description'] = description  
      report['fileInfo'] = fileInfo

      //Form buttons
      report['formEmergency'] = formData['identifier'] == 'form_emergency'
      report['formMobile'] = formData['identifier'] == 'form_mobile'
      report['formMorning'] = formData['identifier'] == 'form_morning'
      report['formAfternoon'] = formData['identifier'] == 'form_afternoon'
      report['formEvening'] = formData['identifier'] == 'form_evening'
      report['formEnter'] = formData['identifier'] == 'form_enter'
      report['formExit'] = formData['identifier'] == 'form_exit'
      report['formHome'] = formData['identifier'] == 'form_home'

      report['isSms'] = isSms
      report['dontShow'] = dontShow

      this.news[feedData['responseId']] = report

      //console.log(report)
      
    }    
  }

  componentDidMount() {      
    
    this.loadJsonForms()

    //Получаем все формы с ответами
    db.collection("feed").get()
    .then(response => {
      response.forEach(doc => {

        //console.log(doc.id, '=>', doc.data())

        const feedData = doc.data()    

        //Выводим файлы или "формы наблюдателей" 
        if(feedData.hasOwnProperty('form_url')){

          //костыль чтобы не обрабатывать старые формы
          if (this.jsonForms.hasOwnProperty(feedData['form_url']) == false){
            console.log("OLD FROM!!!")
            console.log(feedData['form_url'])
            return
          }

          let formData = this.jsonForms[feedData['form_url']]

          this.generateNewsData(feedData, formData)         
        }
      });    
      
      //STATE 
      if (this.state.news !== this.news){                 
            
        this.setState({
          news: this.news
        });
      }    

      this.setState({showSpinner: false})
    })   
  }  

  handleChange = (event) => { 
    this.setState({[event.target.name]: event.target.checked }); 
  };

  handleChangePoolingStation = (event) => { 
    this.searchPoolingStation = event.target.value
  }

  handleChangeDistrict = (event) => { 
    this.searchDistrict = event.target.value
  }

  handleClickClearPoolingStation = (event) => {
    this.setState({searchPoolingStation: 0})    
  }

  handleChangeFilterViolation = (event) => {
    this.setState({filterViolation: event.target.value}); 
  };

  handleClickFindPoolingStation = (event) => {

    const filters =  {
      showSpinner: this.state.showSpinner,
      switchEmergency : this.state.switchEmergency ,
      switchMobile : this.state.switchMobile,
      switchMorning : this.state.switchMorning,
      switchAfternoon : this.state.switchAfternoon,
      switchEvening : this.state.switchEvening,
      switchEnter : this.state.switchEnter,
      switchExit : this.state.switchExit,
      switchHome : this.state.switchHome,
      switchText : this.state.switchText,
      switchImage : this.state.switchImage,
      switchVideo : this.state.switchVideo,
      
      searchPoolingStation : this.searchPoolingStation, 
      searchDistrict : this.searchDistrict, 

      filterViolation : this.state.filterViolation
    }

    this.setState( {filters: filters})
  }

  returnSpinner = () => {
    return (
    <div style = {{
      position: 'absolute',
      height: '100px',
      width: '100px',
      top: '50%',
      left: '50%',
      marginLeft: '-50px',
      marginTop: '-50px',
      }}>
      <CircularProgress size={100} style={{color: 'grey'}}/>
    </div>
    )
  }
  
  render () {
    
    this.generateListOfFilterViolations()

    let isAllowedRender = true
    if(this.state.news === undefined) {
      isAllowedRender = false
    }   

    return (
   <div>     
     <TopPanel></TopPanel>

      <Grid container justify = "center">
        
        <FormGroup row>
          <FormControlLabel
            control={
              <Switch
                checked={this.state.switchEmergency}
                onChange={this.handleChange}
                name="switchEmergency"
                color="Secondary"
              />
            }
            label="Экстренные"
          />
          <FormControlLabel
            control={
              <Switch
                checked={this.state.switchMobile}
                onChange={this.handleChange}
                name="switchMobile"
                color="Secondary"
              />
            }
            label="Мобильные"
          />
          <FormControlLabel
            control={
              <Switch
                checked={this.state.switchMorning}
                onChange={this.handleChange}
                name="switchMorning"
                color="Secondary"
              />
            }
            label="Утренние"
          />
          <FormControlLabel
            control={
              <Switch
                checked={this.state.switchAfternoon}
                onChange={this.handleChange}
                name="switchAfternoon"
                color="Secondary"
              />
            }
            label="Обеденные"
          />
          <FormControlLabel
            control={
              <Switch
                checked={this.state.switchEvening}
                onChange={this.handleChange}
                name="switchEvening"
                color="Secondary"
              />
            }
            label="Вечерние"
          />
          <FormControlLabel
            control={
              <Switch
                checked={this.state.switchEnter}
                onChange={this.handleChange}
                name="switchEnter"
                color="Secondary"
              />
            }
            label="Приход"
          />
          <FormControlLabel
            control={
              <Switch
                checked={this.state.switchExit}
                onChange={this.handleChange}
                name="switchExit"
                color="Secondary"
              />
            }
            label="Уход"
          />
          <FormControlLabel
            control={
              <Switch
                checked={this.state.switchHome}
                onChange={this.handleChange}
                name="switchHome"
                color="Secondary"
              />
            }
            label="Дом"
          />
          <FormControlLabel
            control={
              <Switch
                checked={this.state.switchText}
                onChange={this.handleChange}
                name="switchText"
                color="primary"
              />
            }
            label="Показывать Текст"
          />
          <FormControlLabel
            control={
              <Switch
                checked={this.state.switchImage}
                onChange={this.handleChange}
                name="switchImage"
                color="primary"
              />
            }
            label="Показывать Фото"
          />
          <FormControlLabel
            control={
              <Switch
                checked={this.state.switchVideo}
                onChange={this.handleChange}
                name="switchVideo"
                color="primary"
              />
            }
            label="Показывать Видео"
          />
        </FormGroup>
      </Grid>

      <Grid container justify = "center">
        <TopPoolingStations 
          news={this.state.news}>
        </TopPoolingStations>
      </Grid>      
      
      <Grid container justify = "center">
        <TextField 
          style={{width:'350px'}}
          type='number'
          id="outlined-station" 
          label="№ участка" 
          variant="outlined" 
          onChange={this.handleChangePoolingStation}
        />
        {/* <Button
        style={{width:'15px'}}
          variant="contained"
          //color= 'primary'
          //className={classes.button}
          onClick={this.handleClickClearPoolingStation}
          startIcon={<ClearIcon />}
        >
          
        </Button>           */}
      </Grid>

      <Grid container justify = "center">
        <TextField 
          style={{width:'350px'}}
          id="outlined-district" 
          label="Район" 
          variant="outlined" 
          onChange={this.handleChangeDistrict}
        />
      </Grid>

      <Grid container justify = "center">
        <FormControl style={{width:'350px'}}>
          <NativeSelect
            value={this.state.filterViolation}
            onChange={this.handleChangeFilterViolation}
            name="filterViolation"
            //inputProps={{ 'aria-label': 'filterViolation' }}
          >
            <option value='Любое нарушение'>Любое нарушение</option>
            {
                this.violationList.map(violation => (
                  <option value={violation}>{violation}</option>
              ))
            }
          </NativeSelect>
          <FormHelperText>Выберите фильтр по виду нарушения</FormHelperText>
        </FormControl>
      </Grid>

      <Grid container justify = "center">
        <Button
            style={{width:'350px'}}
            type ='number'
            variant="contained"
            onClick={this.handleClickFindPoolingStation}
            color= 'primary'
            //className={classes.button}
            startIcon={<SearchIcon />}
          >
            Применить фильтры
        </Button>
      </Grid>

      {this.state.showSpinner ? this.returnSpinner() : <div></div>}
      {isAllowedRender
          ? <News 
              news={this.state.news}
              filters={this.state.filters}             
            >

            </News>
          : <div></div>
        }
    </div>
    );
  }
}

export default App;