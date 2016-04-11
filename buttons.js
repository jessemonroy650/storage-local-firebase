/*
    Date: 2016-04-10
*/

$('#commit').on('click',function() {
    console.log('#commit');
});

$('#toggleForm').on('click', function() {
    console.log('#toggleFormVisible');
    var txtIs = document.getElementById('toggleForm').textContent;
    var found = txtIs.search(/^show/);
    var s, t;
    if (found == -1) {s = 'hide'; t = 'show';} else { s = 'show'; t = 'hide';}

    document.getElementById('toggleForm').textContent = txtIs.replace(s, t);
    document.getElementById('theAddForm').classList.toggle('hidden');
});
