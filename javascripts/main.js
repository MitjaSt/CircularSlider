	
	/**
	* CircularSlider module
	* Creates SVG based range sliders
	* 
	* https://github.com/MitjaSt/CircularSlider/
	*/


	/* Module namespace */
	var sl = sl || {};

	(function( objGlobal, objSl )
	{
		'use strict';

		function CircularSlider( objContainer, objOptions )
		{
			/* Dial */
			this.container  = objContainer;
			this.dialList = [];

			/* Set svg width/height width */
			try
			{
				this.svgWidth  = objOptions.width ? objOptions.width : 400;
				this.svgHeight  = objOptions.height ? objOptions.height : 400;	
			}
			catch(  $e )
			{
				throw 'CircularSlider: Missing second parameter (width,height).';
			}

			/* Create main SVG element */
			this.objSvg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
			this.objSvg.setAttribute( 'class', 'sliders' );
			
			this.objSvg.setAttribute( 'width', this.svgWidth );
			this.objSvg.setAttribute( 'height', this.svgWidth );
			
			/* Create dial button svg linearGradient element */
			var objLinearGradient = document.createElementNS( 'http://www.w3.org/2000/svg', 'linearGradient' );

			objLinearGradient.setAttribute( 'id', 'buttonGradient' );

			objLinearGradient.setAttribute( 'x1', 1 );
			objLinearGradient.setAttribute( 'y1', 1 );
			objLinearGradient.setAttribute( 'x2', 0 );
			objLinearGradient.setAttribute( 'y2', 0 );

			/* Start gradient at */
			var objGradientStartAt = document.createElementNS( 'http://www.w3.org/2000/svg', 'stop' );

			objGradientStartAt.setAttribute( 'offset', '0%' );
			objGradientStartAt.setAttribute( 'stop-color', '#ffffff' );

			/* End gradient at */
			var objGradientEndAt = document.createElementNS( 'http://www.w3.org/2000/svg', 'stop' );

			objGradientEndAt.setAttribute( 'offset', '100%' );
			objGradientEndAt.setAttribute( 'stop-color', '#e0e1e2' );

			objLinearGradient.appendChild( objGradientStartAt );
			objLinearGradient.appendChild( objGradientEndAt );

			/* Add gradient to SVG element */
			this.objSvg.appendChild( objLinearGradient );

			/* Create labels wrapper */
			this.labels = document.createElement( 'div' );
			this.labels.setAttribute( 'class', 'labels' );

			return this;
		}

		/* Create new instance of dial */
		CircularSlider.prototype.createDial = function( objUserOptions )
		{
			/* Default options */
			var objOptions = { 	
								color 		: '#000000',

								value 		: 0,
								minValue 	: 0,
								maxValue 	: 100,
								
								step 	 	: 20,
								
								radius 	 	: 200,
								labelText 	: 'Počitnice',
								dragMode 	: false,
								labelPrefix : '',
								labelSuffix : '',
								labelFormat : null
							 };

			/* Merge default and developer options */
			for( var mixProperty in objUserOptions )
			{
				objOptions[ mixProperty ] = objUserOptions[ mixProperty ];
			}

			/* Create new dial element */
			this.dialList.push( new CircularSlider.Dial( this.dialList.length, objOptions, this ) );

			return this;
		}

		/* Add SVG and label elements to container */
		CircularSlider.prototype.create = function()
		{
			/* Append dials and labels */
			for( var intNo in this.dialList )
			{
				/* Create dial elements */
				this.objSvg.appendChild( this.dialList[ intNo ].path );
				this.objSvg.appendChild( this.dialList[ intNo ].circle );
				this.objSvg.appendChild( this.dialList[ intNo ].button );

				/* Create label elements */
				var objLabelWrapper = document.createElement( 'div' );
				objLabelWrapper.setAttribute( 'class', 'label' );

				/* Update label with default/developer set value */
				this.dialList[ intNo ].updateLabel();

				/* Add label elements */
				objLabelWrapper.appendChild( this.dialList[ intNo ].label.value );
				objLabelWrapper.appendChild( this.dialList[ intNo ].label.color );
				objLabelWrapper.appendChild( this.dialList[ intNo ].label.labelText );

				this.labels.appendChild( objLabelWrapper );

				/* Set drag element events */
				this.dialList[ intNo ].setDragEvents();
			}

			this.container.appendChild( this.labels );
			this.container.appendChild( this.objSvg );
		}

		
		/* CircularSlider Dial class */
		CircularSlider.Dial = function( intDialNo, objOptions, objSlider )
		{
			/* Dial number */
			objOptions.dialNo = intDialNo;

			this.slider = objSlider;
			this.options = objOptions;

			/* Set dial value to default if below minValue */
			this.options.value = this.options.value < this.options.minValue ? this.options.minValue : this.options.value;

			/* Circle center position (cx,cy) */
			var intCenter = this.slider.svgWidth / 2;

			/* Create path for value background */
			this.path = document.createElementNS("http://www.w3.org/2000/svg", 'path' );

			/* Get dial angle based on value */
			var intAngle = Math.floor( 360 / this.options.maxValue * this.options.value );
			
			/* Modify path to close ("z") for full circle */
			if( intAngle < 360 )
			{
				var strPathD = this.describeArc( intCenter, intCenter, this.options.radius, 0, intAngle );	
			}
			else
			{
				intAngle = 359;
				var strPathD = this.describeArc( intCenter, intCenter, this.options.radius, 0, intAngle ) + 'z';
			}

			/* Create gradient stroke */
			var objLinearGradient = document.createElementNS( 'http://www.w3.org/2000/svg', 'linearGradient' );

			/* Random gradient ID */
			var intGradientId = 'lg_' + Math.random().toString().replace( '.', '_' );

			objLinearGradient.setAttribute( 'id', intGradientId );

			objLinearGradient.setAttribute( 'x1', 1 );
			objLinearGradient.setAttribute( 'y1', 1 );
			objLinearGradient.setAttribute( 'x2', 0 );
			objLinearGradient.setAttribute( 'y2', 0 );

			/* Start gradient at color */
			var objGradientStartAt = document.createElementNS( 'http://www.w3.org/2000/svg', 'stop' );

			objGradientStartAt.setAttribute( 'offset', '0%' );
			objGradientStartAt.setAttribute( 'stop-color', this.options.color );

			/* End gradient at color */
			var objGradientEndAt = document.createElementNS( 'http://www.w3.org/2000/svg', 'stop' );

			objGradientEndAt.setAttribute( 'offset', '100%' );
			objGradientEndAt.setAttribute( 'stop-color', ColorLuminance( this.options.color.substr( 1 ), -0.3 ) );

			/* Append start/end gradient colors */
			objLinearGradient.appendChild( objGradientStartAt );
			objLinearGradient.appendChild( objGradientEndAt );

			/* Append new linearGradient to SVG element */
			this.slider.objSvg.appendChild( objLinearGradient );

			/* Set dial path to use linearGradient */
			this.path.setAttribute( 'stroke', 'url(#' + intGradientId + ')' );

			/* Other path attributes */
			this.path.setAttribute( 'stroke-width', '30' );

			this.path.setAttribute( 'fill', 'none' );
			this.path.setAttribute( 'opacity', '1' );
			this.path.setAttribute( 'd', strPathD );

			/* Circle dashed background */
			this.circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle' );

			this.circle.setAttribute( 'cx', intCenter );
			this.circle.setAttribute( 'cy', intCenter );
			this.circle.setAttribute( 'r', this.options.radius );

			this.circle.setAttribute( 'fill', 'none' );
			this.circle.setAttribute( 'stroke', '#000' );
			this.circle.setAttribute( 'opacity', '0.05' );
			this.circle.setAttribute( 'stroke-width', '30' );
			this.circle.setAttribute( 'stroke-dasharray', '7,2' );

			/* Dial button */
			this.button = document.createElementNS("http://www.w3.org/2000/svg", 'circle' );
			
			var objButtonPosition = this.getButtonPosition( this.options.radius, intCenter );
			
			this.button.setAttribute( 'cx', objButtonPosition.cx );
			this.button.setAttribute( 'cy', objButtonPosition.cy );
			this.button.setAttribute( 'r', 20 );

			this.button.setAttribute( 'fill', 'url(#buttonGradient)' );
			this.button.setAttribute( 'stroke', '#a4a1a1' );
			this.button.setAttribute( 'opacity', '1' );
			this.button.setAttribute( 'stroke-width', '1' );

			/* Create label elements */
			this.label = {};
			
			this.label.value = document.createElement( 'div' );
			this.label.value.setAttribute( 'class', 'value' );
			this.label.value.innerHTML = this.options.value;

			this.label.color = document.createElement( 'div' );
			this.label.color.setAttribute( 'class', 'color' );
			this.label.color.style.backgroundColor = this.options.color;

			this.label.labelText = document.createElement( 'div' );
			this.label.labelText.setAttribute( 'class', 'text' );
			this.label.labelText.innerHTML = this.options.labelText;

			return this;
		}

		CircularSlider.Dial.prototype.setDragEvents = function()
		{
			var objDial = this;

			function enableDrag()
			{
				objDial.options.dragMode = true;
			}

			function disableDrag()
			{
				objDial.options.dragMode = false;
			}

			/* Register events - desktop */
			this.button.addEventListener( 'mousedown', enableDrag, false );
			this.button.addEventListener( 'mouseup', disableDrag, false );

			document.addEventListener( 'mouseup', disableDrag, false );

			document.addEventListener( 'mousemove', function( e ){ objDial.drag( e ); }, false );

			/* Register events - touchscreen */
			this.button.addEventListener( 'touchstart', enableDrag, false );
			this.button.addEventListener( 'touchend', disableDrag, false );
			this.button.addEventListener( 'touchcancel', disableDrag, false );
			this.button.addEventListener( 'touchleave', disableDrag, false );

			this.button.addEventListener( 'touchmove', function( e ){ objDial.drag( e ); }, false );
		}

		/* Dial drag method */
		CircularSlider.Dial.prototype.drag = function( e )
		{
	      	if( !this.options.dragMode )
	      	{
	      		return;
	      	}

	      	e.preventDefault();

			var intCenter = this.slider.svgWidth / 2;
			var intRadius = this.options.radius;

			/* Get touch/mouse positions */
			var intRelativeX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX,
				intRelativeY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

			/* Container top/left positions */
			var objContainerPosition = this.slider.objSvg.getBoundingClientRect();

			/* Calculate event relative x/y */
			intRelativeX -= objContainerPosition.left + intCenter;
			intRelativeY -= objContainerPosition.top + intCenter;

			/* Get event angle */
			var intAngle = Math.atan2( intRelativeX, intRelativeY );
			intAngle *= 180 / Math.PI // Rads to degs
			intAngle = Math.abs( intAngle - 180 );

			/* Percentage of value based on angle */
			var intPercentage = intAngle / 360;

			/* Get dial value based on percentage */
			this.options.value = this.options.maxValue * intPercentage;

			if( this.options.value < this.options.minValue )
			{
				this.options.value = this.options.minValue;
			}

			/* Modify angle according to step information */
			if( this.options.value < this.options.step / 2 )
			{
				this.options.value = Math.floor( this.options.value / this.options.step ) * this.options.step;
			}
			else
			{
				this.options.value = Math.ceil( this.options.value / this.options.step ) * this.options.step;	
			}

			/* Modify angle based on value and percentage */
			intAngle = ( this.options.value / this.options.maxValue ) * 360;

			/* Update label data */
			this.updateLabel();

			/* Modify circle path */
			if( intAngle < 360 )
			{
				var strPathD = this.describeArc( intCenter, intCenter, intRadius, 0, intAngle );	
			}
			else
			{
				intAngle = 359;
				var strPathD = this.describeArc( intCenter, intCenter, intRadius, 0, intAngle ) + 'z';
			}

			this.path.setAttribute( 'd', strPathD );

			/* Modify button position */
			var intButtonAngle = ( 90 - intAngle ) * Math.PI / 180;

			this.button.setAttribute( 'cx', Math.floor( intCenter + intRadius * Math.cos( intButtonAngle ) ) );
			this.button.setAttribute( 'cy', Math.floor( intCenter - intRadius * Math.sin( intButtonAngle ) ) );
		}


		/* Get dial button position (cx,cy) */
		CircularSlider.Dial.prototype.getButtonPosition = function( intRadius, intCenter )
		{
		      var intAngle = 360 / this.options.maxValue * this.options.value;

		      if( intAngle > 360 )
		      {
		      	intAngle = 360;
		      }

		      var a = ( 90 - intAngle ) * Math.PI / 180,
		          intCx = intCenter + intRadius * Math.cos( a ),
		          intCy = intCenter - intRadius * Math.sin( a );

		      return {
		        cx: intCx,
		        cy: intCy
		      };
		}

		/* Update label with current value */
		CircularSlider.Dial.prototype.updateLabel = function()
		{
			if( typeof this.options.labelFormat == 'function' )
			{
				this.label.value.innerHTML = this.options.labelFormat( this.options.value );
			}
			else
			{
				this.label.value.innerHTML = this.options.labelPrefix + this.options.value + this.options.labelSuffix;	
			}

		    return this;
		}

		/* polarToCartesian */
		CircularSlider.Dial.prototype.polarToCartesian = function( intCenterX, intCenterY, intRadius, intAngleInDegrees )
		{
			var floatAngleInRadians = ( intAngleInDegrees - 90 ) * Math.PI / 180.0;

			return {
				x: intCenterX + ( intRadius * Math.cos( floatAngleInRadians ) ),
				y: intCenterY + ( intRadius * Math.sin( floatAngleInRadians ) )
			};
		}

		/* Creates SVG Path "d" circle string */
		CircularSlider.Dial.prototype.describeArc = function( intX, intY, intRadius, intStartAngle, intEndAngle )
		{
		    var objStart = this.polarToCartesian( intX, intY, intRadius, intEndAngle );
		    var objEnd   = this.polarToCartesian( intX, intY, intRadius, intStartAngle );

		    var intArcSweep = intEndAngle - intStartAngle <= 180 ? 0 : 1;

		    var strD = [
		        'M', objStart.x, objStart.y, 
		        'A', intRadius, intRadius, 0, intArcSweep, 0, objEnd.x, objEnd.y
		    ].join( ' ' );

		    return strD;       
		}

		/* Creates variations of based color (lighter/darker) */
		function ColorLuminance( strHex, floatLiminance )
		{
			// Validate hex string
			strHex = String( strHex ).replace( /[^0-9a-f]/gi, '' );
			
			if( strHex.length < 6 )
			{
				strHex = strHex[0] + strHex[0] + strHex[1] + strHex[1] + strHex[2] + strHex[2];
			}

			floatLiminance = floatLiminance || 0;

			// Convert to decimal and change luminosity
			var strRgb = "#", c, i;

			for( i = 0 ; i < 3 ; i++ )
			{
				c = parseInt( strHex.substr( i * 2, 2 ), 16 );

				c = Math.round( Math.min( Math.max( 0, c + ( c * floatLiminance ) ), 255 ) ).toString( 16 );
				strRgb += ( '00' + c ).substr( c.length );
			}

			return strRgb;
		}

		objSl.CircularSlider = CircularSlider;

	} )( window, sl );