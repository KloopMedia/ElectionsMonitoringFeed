import titles from './violationsList'

const matchTitle = (title) => {
    if (title in titles) {
        return titles[title]
    }
    else {
        return title.slice(3)
    }      
}

export default matchTitle;