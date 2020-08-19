
const slides = document.querySelectorAll('section');
var currentSlide;

// keep track of current slide using intersectionobserver
// current = last slide to scroll at least halfway into view
const intersectionObserver = new IntersectionObserver( entries =>
	{
		
		// set current slide
		var oldSlide = currentSlide;
		currentSlide = entries.sort( ( a, b ) => {
			return b.intersectionRatio - a.intersectionRatio;
		} )[ 0 ].target;
		
		if ( oldSlide !== currentSlide ) {
			if ( oldSlide && oldSlide.onExit ) { oldSlide.onExit( oldSlide ); }
			if ( currentSlide.onEnter ) { currentSlide.onEnter( currentSlide ); }
		}
		
		// show the presenter’s notes
		if (  /* false && */ currentSlide.querySelector('.notes') !== null ) {
			console.clear();
			console.log(currentSlide.querySelector('.notes').innerHTML);
		}
		
	},
	{ threshold: [ 0.5 ] } 
); 

// init each slide
for ( slide of slides ) {

	// start intersectionObserving
	intersectionObserver.observe( slide );
	
	// do any setup
	if ( slide.init !== undefined ) {
		slide.init( slide );
	}
	
	// and queue up first event
	if ( slide.events !== undefined ) {
		slide.nextEvent = slide.events[ 0 ];
	}

}

// next/previous
// aka what to do when I hit the clicker
window.addEventListener( 'keydown', function( event ) {

	if ( event.keyCode == 34 || event.keyCode == 39 ) { // page down || right arrow
		event.preventDefault();
		
		// if there are events to do, do ’em
		if ( currentSlide.nextEvent !== undefined ) {
			
			currentSlide.nextEvent.do( currentSlide );
			currentSlide.previousEvent = currentSlide.nextEvent;
			currentSlide.nextEvent = currentSlide.events[
				currentSlide.events.indexOf( currentSlide.nextEvent ) + 1 ];
		
		// otherwise...
		} else {
		
			// ...scroll ot the next slide
			// which is a viewport below the current slide
			window.scrollTo( 0,
				currentSlide.getBoundingClientRect().bottom - document.body.getBoundingClientRect().top
			);
		
		}
		
	} else if ( event.keyCode == 33 || event.keyCode == 37 ) { // page up || back arrow

		event.preventDefault();
		
		// if there are events to undo, undo them
		if ( currentSlide.previousEvent !== undefined ) {
			
			currentSlide.previousEvent.undo( currentSlide );
			currentSlide.nextEvent = currentSlide.previousEvent;
			currentSlide.previousEvent = currentSlide.events[
				currentSlide.events.indexOf( currentSlide.previousEvent ) - 1 ];
		
		// otherwise...
		} else {
		
			// ...scroll to the previous slide
			// which is a viewport above the current slide
			window.scrollTo( 0,
				currentSlide.getBoundingClientRect().top -
				currentSlide.getBoundingClientRect().height -
				document.body.getBoundingClientRect().top
			);
			
		}
		
	}

} );


document.querySelectorAll( 'video' ).forEach( ( video ) => {
	video.addEventListener( 'click', ( ) => {
		( video.paused ? video.play() : video.pause() );
	} );
} );