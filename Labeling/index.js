$('#f').on('change', function(ev) {
    var f = ev.target.files[0];
    var fr = new FileReader();
    
    fr.onload = function(ev2) {
        console.dir(ev2);
        $('#i').attr('src', ev2.target.result);
    };
    
    fr.readAsDataURL(f);
});

var cont = document.getElementById('labelContainer');

var slideSpacing = document.getElementById('well_spacing');
slideSpacing.onchange = function() {
    var valu = this.value;	
	$('.well').each(function(i, obj) {
		obj.style.width = valu;
	});
};

var slideLeft = document.getElementById('well_left');
slideLeft.onchange = function() {
    cont.style.left = this.value;	
};

var slideTop = document.getElementById('well_top');
slideTop.onchange = function() {
    cont.style.top = this.value;	
};

var primerHTML = document.getElementById('tempPrimer').innerHTML;
var emptyWellHTML = document.getElementById('tempEmptyWell').innerHTML;

var addPrimer = document.getElementById('add_primer');
addPrimer.onclick = function() {
    document.getElementById('labelContainer').innerHTML = document.getElementById('labelContainer').innerHTML + primerHTML;	
};

var addWell = document.getElementById('add_well');
addWell.onclick = function() {
	var tables = document.getElementById('labelContainer').getElementsByTagName("table");
	var lastTable = tables[tables.length-1];
	lastTable.getElementsByTagName("tr")[0].innerHTML = lastTable.getElementsByTagName("tr")[0].innerHTML + "<td class='well'><input class='well' type='text'></td>";
};

var addEmpty = document.getElementById('add_empty_well');
addEmpty.onclick = function() {
    document.getElementById('labelContainer').innerHTML = document.getElementById('labelContainer').innerHTML + emptyWellHTML;	
};

