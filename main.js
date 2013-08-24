$(function(){
  var containerEl = 'div.fl_detail_info',
  titleEl = 'h2 a',
  yearEl = 'h2 span',
  reg = new RegExp('[SE]{1}[0-9]{2}','i'),
  matches,
  movieTitle,
  movieYear;

  //get all film listing
  matches = $(containerEl);


  matches.each(function(item){
      var that = this;

      //grab title and year for film
      movieTitle = $(this).find(titleEl).text();
      movieYear = $(this).find(yearEl).text().substring(1,5);

      //check if listing is for a tv episode rather than a film
      if(!reg.test(movieTitle)){
          //make call to imdb to get film details
          $.ajax({
              url: 'http://www.deanclatworthy.com/imdb/?q='+movieTitle+'&year='+movieYear,
              success: function(obj){
                  //hack response to form proper JSON when rate limited
                  var divided = obj.replace('}{','},{');
                  var wrapper = '['+divided+']';
                  var json = $.parseJSON(wrapper);
                  var data;
                  //if rate limited error will be first item in array
                  if(json.length > 1){
                      data = json[1];
                  } else {
                      data = json[0];
                  }
                  //Check for undefined data
                  if('imdbid' in data){
                      $(that).find('h2').append(' <a style="color:#f0f;" href="'+data.imdburl+'">'+data.rating+'</a><span style="font-size:0.8em;"> - '+data.votes+'</span>');
                  }
              }
          });
      }
  });

});

i=0;
$('#main-content .shelf ul.grid-view li').each( function() {


  $launcher = $('<div>*</div>')
  h3 = $('h3', this)

  $launcher
  .css({float: 'right', marginLeft: '0.2em', color: '#888', fontSize: '4em', cursor: 'pointer'})
  .appendTo(h3)
  .click(function() {
    $el = $(this);
    var title = $(this).siblings('a').find('span').html()
    $.getJSON('http://www.deanclatworthy.com/imdb/?q='+title, function(movie) {
      $el.css({fontSize: '1.5em'});
      if (movie) {
        $el.html(movie.rating + '*').css({color: '#ffc20b'})
        $el.parent().css({height: 60});
      } else {
        $el.html('&mdash;').css({color: '#800'})
      }
    });
  });

});

