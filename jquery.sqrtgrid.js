(function ($) 
{
    function SuperGrid(instance, options) // class defenition
    {
        this.settings = $.extend({}, $.fn.superGrid.defaults, options);
        var supergrid = 
        	$(instance),
        	canvas = $("#myCanvas").get(0),
			context = canvas.getContext("2d"),
            self = this,
            cXunits = 10, 									// Number of units that will fit horizontally
			cYunits = 200,
			cGridSize = cXunits * cYunits, 					// Total number of units in de image grid.
			cNumShapes = 7,									// Number of units that will fit horizontally
			aBitGrid = new Array(cGridSize), 				// This array is a binary linear representation of the image grid.
			aShapeOrientation = new Array(cNumShapes),		// Shapes, where 0 is the smallest shape size.
			aShapeWidth = new Array(cNumShapes),
			aShapeHeight = new Array(cNumShapes),
			aShapeColor = new Array(cNumShapes),
			UnitWidth =  $(instance).clientWidth / (Math.SQRT2 * cXunits),	// Calculate the unit width.
			UnitHeight = ($(instance).clientWidth / (Math.SQRT2 * cXunits)) / Math.SQRT2; // Calculate the unit height.
        	init();

        function init() 
        {
        	console.log('init supergrid');
        	InitializeGrid();
			InitializeShapes();
			DoRectangles();
        }
        
        // Init Grid bit values 
        function InitializeGrid()
		{
			// Initialise the grid
			var i;
			for( i = 0; i < cGridSize; i++ )
				aBitGrid[i] = false;
		}
		
		// Init the shapes, starting with a landscape offset.
		function InitializeShapes()
		{
			var i;	
			for( i = 0; i < cNumShapes; i++ )
			{
				if( (i % 2) == 0 )
				{
					aShapeOrientation[i] = 'L';	
					if( i == 0 ) aShapeWidth[i] = aShapeHeight[i] = 1;
					else		 aShapeWidth[i] = aShapeHeight[i] = aShapeWidth[i - 1] * 2;
				}
				else
				{
					aShapeOrientation[i] = 'P';
					aShapeWidth[i] = aShapeWidth[i - 1];
					aShapeHeight[i] = aShapeWidth[i - 1] * 2;
				}
				console.log( 'Shape[' + i + '] type = ' + aShapeOrientation[i] + ' width = ' + aShapeWidth[i] + ' - height = ' + aShapeHeight[i] );
			}
		}	
		
		function DoRectangles()
		{
			var r;
			var o = GetOffSet();
					
			while( o != -1 )
			{
				var s = Math.ceil(Math.random() * cNumShapes );						
				// Try random shapes until one will fit.
				while( !WillShapeFit(o, s) )
				{
					console.log( ' !WillShapeFit = ' + s ); 
					s = Math.ceil(Math.random() * cNumShapes );
				}
				SetShape( o, s );
				DrawShape( o, s );
				o = GetOffSet();
			}
		}
				
		// Get the first free unit offset
		function GetOffSet()
		{
			var i;
					
			for( i = 0; i < cGridSize; i++ )
			{
				if( aBitGrid[i] == false )	return i;
			}
			return -1;
		}
		
		// Determine if a certain shape will fit on a certain location
		function WillShapeFit( offset, shape )
		{
			var x, y;
				
			// The shape will not fitt the width, from this offset
			if( ((offset % cXunits) + aShapeWidth[shape]) > cXunits )
			{
				console.log( 'WillShapeFit offset = ' + offset + ' shape = ' + shape + ' FALSE' );
				return false;
			}
			// Now check for overlapping shapes from an erlier row.
			for( y = 0; y < aShapeHeight[shape]; y++ )
			{
				for( x = 0; x < aShapeWidth[shape]; x++ )
				{
					if( aBitGrid[offset + (y * cXunits) + x] != false )	return false;
				}
			}
			return true;
		}
		
		// Mark the space in the grid as occupied.
		function SetShape( offset, shape )
		{
			var x, y;
			
			// Set the shape bits in the grid.
			for( y = 0; y < aShapeHeight[shape]; y++ )
			{
				for( x = 0; x < aShapeWidth[shape]; x++ )
				{
					aBitGrid[offset + (y * cXunits) + x] = true;		
				}
			}
		}
		
		function DrawShape( offset, shape )
		{
			var x, y, w, h;
					
			y = UnitHeight * Math.floor( offset / cXunits );
			x = UnitWidth * (offset % cXunits);
			w = aShapeWidth[shape] * UnitWidth;
			h = aShapeHeight[shape] * UnitHeight;
					
			context.fillStyle = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
			context.fillRect(x,y,w,h);
		}
/*
        this.nextPanel = nextPanel;
        this.previousPanel = previousPanel;
        this.openPanel = openPanel;
        this.startSlideshow = function () {
            startSlideshow();
        };
        this.stopSlideshow = function () {
            stopSlideshow();
        };
        this.getSlideshowState = function () {
            return slideshowState;
        };
        this.getCurrentIndex = function () {
            return currentIndex;
        };
        this.getPanelAt = function (index) {
            return panels[index];
        };
        this.getAccordionState = function () {
            return accordionState;
        };
        this.resize = function (w, h) {
            resize(w, h);
        };
*/        
    }
    $.fn.superGrid = function (options) 
    {
        var collection = [];
        console.log('accessing instance');
        for (var i = 0; i < this.length; i++) 
        {
            if (!this[i].superGrid) 
            {
            	console.log('creating new instance');
                this[i].superGrid = new SuperGrid(this[i], options);
                collection.push(this[i].superGrid);
            }
        }
        return collection.length > 1 ? collection : collection[0];
    };
    
    $.fn.superGriddefaults = {
        cXunits: 20,
        cYunits: 200,
        cNumShapes: 7
    };
})(jQuery);