/*
    Date: 2016-03-07

*/
function updateScreenTotal (number) {
    document.getElementById('storelocal').textContent = "items:" + number;
}
//////////////////////////////////////////////////////////////////////
/*

*/
//
removeKeyCallback = function (e) {
    console.log('removeKey');
    recordItem.remove(e);
    // Redraw list by clicking the button that draws it.
    visualList.redraw();
};
//
updateKeyCallback = function (e) {
    console.log('updateKey');
    recordItem.update(e, {l:'#_label' , v:'#_value'});
    // Redraw list by clicking the button that draws it.
    visualList.redraw();
}; 
//
function bindClassOnEvent(theClass, event, theCallback) {
     // http://www.w3schools.com/jsref/met_document_getelementsbyclassname.asp
    // Returns an array of HTML objects
    var x = document.getElementsByClassName(theClass);
    var i, j = x.length;
    for (i = 0; i < j; i ++) {
        //console.log(x[i], event, theCallback);
        x[i].addEventListener(event, theCallback);
    }
}
//////////////////////////////////////////////////////////////////////
/*

*/
var visualList = {
    //
    redraw : function () {
        document.getElementById('showList').click();
    },
    // http://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
    removeListById : function (parentId) {
        var parentNode = document.getElementById(parentId);
        while (parentNode.firstChild) {
            parentNode.removeChild(parentNode.firstChild);
        }
    },
    //
    createItem : function (appendPoint, data, labels) {
        var yPoint = drawData.headNode(data.k, "oneRecord");           // data wrapper
        drawData.inputNode(yPoint, "_label", {'pholder':labels.phLabel, 'value':data.k}); // key
        drawData.br(yPoint);
        drawData.inputNode(yPoint, "_value", {'pholder':labels.phValue, 'value':data.v}); // value
        drawData.br(yPoint);
        //var zPoint = drawData.div(yPoint, 'fspacer');
        drawData.button(yPoint, '', labels.buttonRemove, 'removeKey'); // remove button
        var x = drawData.span(yPoint, '', 'fspacer');
        x.innerHTML = '&nbsp;'; // There might be a better way to do this. I don't know it.
        drawData.button(yPoint, '', labels.buttonUpdate, 'updateKey'); // update button
        appendPoint.appendChild(yPoint);
    },
    //
    createList : function ( start, end, appendPoint  ) {
        var i = start;
        var k = '', v = '', ddata = [];
        for (i = start; i < end; i++) {
            // some Javascript engines cannot do this.
            // [k,v] = getListItem(i);
            ddata = recordList.getItem(i);
            k = ddata[0];
            v = ddata[1];
            console.log(i + ":" + k + ":" + v);
            //
            visualList.createItem(appendPoint,
                {'k':k, 'v':v},
                {'phLabel':"RSS",'phValue':"URL",
                 'buttonRemove':"remove",'buttonUpdate':"update"}
            );
        }
    },
    draw : function ( listLen, appendPoint ) {
        var rlist = {};
        // create a mounting pint
        rlist = drawData.headNode('recordList');
        // create the visual data list
        visualList.createList(0, listLen, rlist);
        // append list to appendPoint
        appendPoint.appendChild(rlist);
        
        bindClassOnEvent('removeKey', 'click', removeKeyCallback);
        bindClassOnEvent('updateKey', 'click', updateKeyCallback);
    }
}


//////////////////////////////////////////////////////////////////////
/*
    LIST
*/
//
var recordList = {
    clear: function (evt) {
        localStore.clear();
        visualList.redraw();
    },
    getLength : function () {
        return localStore.len();
    },
    getItem : function (i) {
        return recordItem.get(i);
    },
    setItem : function (e) {
        recordItem.set(e);
        visualList.redraw();
    },
    show : function () {
        var llen = recordList.getLength();

        updateScreenTotal(llen);
        visualList.removeListById('records');

        // If we have items, draw
        if (llen > 0 ) {
            visualList.draw(llen, document.getElementById('records'));
        }
    }

}
/*
    ITEM
*/
var recordItem = {
    set : function (evt) {
        console.log('recordItem.set()');
        // 'formIds' is global.
        var k = document.getElementById(formIds.key).value;
        var v = document.getElementById(formIds.value).value;
        // console.log("recordItem.set:", k, v);
        // filter against blank fields
        localStore.put(k, v);
        // clear form values
        document.getElementById(formIds.key).value   = '';
        document.getElementById(formIds.value).value = '';
    }, 
    get : function getItem(idx) {
        k = localStore.key(idx);
        v = localStore.get(localStore.key(idx));
        return [k,v];
    },
    remove : function (evt) {
        var id = evt.target.parentNode.id;
        console.log("remove:",id);
        localStore.remove(id);
    },
    update : function (evt, selector) {
        //console.log('.updateKey');
        var id = evt.target.parentNode.id;
        var l  = evt.target.parentNode.querySelector(selector.l).value;
        var v  = evt.target.parentNode.querySelector(selector.v).value;
        localStore.update({id:id, key:l, value:v});
    }
}


var formIds = {'key':'key','value':'value'};
//
/* */
document.getElementById('clearList').addEventListener('click', recordList.clear);
document.getElementById('showList').addEventListener('click', recordList.show);


if (document.getElementById('setItem')) {
    document.getElementById('setItem').addEventListener('click', recordList.setItem);
} else {
    console.log("creating theAddForm'");
    // create wrapper
    var theAddForm = drawData.headNode('theAddForm');
    // create input fields
    drawData.inputNode(theAddForm, formIds.key, {'pholder':"Enter label"});
    drawData.br(theAddForm);
    drawData.inputNode(theAddForm, formIds.value, {'pholder':"Enter data"});
    drawData.br(theAddForm);
    // commit button
    drawData.button(theAddForm, 'setItem', 'add');
    // 
    document.getElementById('theAddForm').appendChild(theAddForm);
    document.getElementById('setItem').addEventListener('click', recordList.setItem);
}
