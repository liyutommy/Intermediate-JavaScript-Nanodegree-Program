const addActiveAttr = () => {
    // url address
    const loc = window.location.href;
    // retrieve the subpath after last forward slash
    const subpath = loc.substring(loc.lastIndexOf('/')+1);
    // buttons' id
    const subpathList = Immutable.List(['', 'curiosity', 'opportunity', 'spirit']);
    // add active attributes to a specific navbar button
    if(subpathList.includes(subpath)){
        let ele;
        if(subpath === ''){
            ele = document.getElementById('home');
        } else{
            ele = document.getElementById(`${subpath}Button`);
        }
        // the navbar button's attributes add 'active'
        ele.classList.add('active');
        ele.setAttribute('aria-current', 'page');
    }
}

const setFooterPos = () => {
    const footer = document.getElementsByTagName('footer')[0];
    // if the page has the scroll bar, footer element has the attribute 'sticky-bottom'
    // otherwise, set its position fixed
    if(document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight)){
        footer.classList.add('sticky-bottom');
    } else {
        footer.classList.add('fixed-bottom');
    }
}


(function(){
    addActiveAttr();
    setFooterPos();
})()


