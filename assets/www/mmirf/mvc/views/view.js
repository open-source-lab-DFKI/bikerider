﻿/*
 * 	Copyright (C) 2012-2013 DFKI GmbH
 * 	Deutsches Forschungszentrum fuer Kuenstliche Intelligenz
 * 	German Research Center for Artificial Intelligence
 * 	http://www.dfki.de
 * 
 * 	Permission is hereby granted, free of charge, to any person obtaining a 
 * 	copy of this software and associated documentation files (the 
 * 	"Software"), to deal in the Software without restriction, including 
 * 	without limitation the rights to use, copy, modify, merge, publish, 
 * 	distribute, sublicense, and/or sell copies of the Software, and to 
 * 	permit persons to whom the Software is furnished to do so, subject to 
 * 	the following conditions:
 * 
 * 	The above copyright notice and this permission notice shall be included 
 * 	in all copies or substantial portions of the Software.
 * 
 * 	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
 * 	OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
 * 	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * 	IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY 
 * 	CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
 * 	TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * 	SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


/**
 * @module mobileDS.mvc.views
 * 
 */
var mobileDS = window.mobileDS ||
{};


/**
 * The View class is a kind of interface-class which gives access to the methods and data of a helper (which itself belongs to a controller)<br>
 * Apart from initialising some properties, the constructor also parses the view description and looks for needed helper methods.
 * 
 * @class View
 * @constructor
 * @param {Object} ctrl Controller instance / object
 * @param {String} name Name of the View 
 * @param {String} definition View description
 * @category core
 */
function View(ctrl, name, definition){
    
//	console.log("[View] '" + name + "' loaded.");
	
	if(definition){
	    // remove HTML comments from View
	    definition = definition.replace(mobileDS.CommonUtils.getInstance().regexHTMLComment, '');//remove HTML comments!  .replace(HTMLCommentRegExp,"");
	}
	
    /**
     * The controller to which this view belongs.
     * 
     * @property controller
     * @type Object
     * @public
     */
    this.controller = ctrl;
	
    /**
     * The description of the view in eHTML.
     * 
     * @property def
     * @type String
     * @public
     */
    this.def = definition;
	
    /**
     * The name of the view.
     * 
     * @property name
     * @type String
     * @public
     */
    this.name = name;
   
	
    /**
     * An array of all the views {@link mobileDS.ContentElement} objects.<br>
     * 
     * @property contentFors
     * @type Array
     * @public
     */
    this.contentFors = new Array();
   
	
    /**
     *
     * An array of all names of the for the view required helper methods.
     * 
     * @deprecated helper methods must now explicitly called in template definition (using syntax <code>@helper(name,args)</code>)
     * 
     * @property helperMethods
     * @type Array
     * @public
     */
    this.helperMethods = new Array();
    

    if(this.def){
	    var parser = mobileDS.parser.ParserUtils.getInstance();
	    var renderer = mobileDS.parser.RenderUtils.getInstance();
	    
	    
	    var parseResult = parser.parse(this.def, this);
	    
	    for(var i=0, size = parseResult.contentFors.length; i < size ; ++i){
	    	this.contentFors.push(new ContentElement(parseResult.contentFors[i], this, parser, renderer));
	    }
    }
    
}

/**
 * Gets the definition of a view.
 * 
 * @function getDefinition
 * @returns {String} The view description string
 */
View.prototype.getDefinition = function(){
    return this.def;
};


/**
 * Gets the name of a view. 
 * 
 * @function getName
 * @returns {String} The name of the view
 */
View.prototype.getName = function(){
    return this.name;
};

/**
 * Gets the name of a view. 
 * 
 * @function getController
 * @returns {Object} The controller for the view
 */
View.prototype.getController = function(){
    return this.controller;
};


/**
 * Gets a specific {@link mobileDS.ContentElement} object by name. 
 * 
 * @function getContentElement
 * @param {String} name Name of the ContentElement object
 * @returns {object} The wanted ContentElement object or null
 */
View.prototype.getContentElement = function( name){
//    var result = null;
//	//this.controller = ctrl;
//    $.each(this.contentFors, function(index, content){
//    
//        if (content.getName() == name) {
//            result = content;
//        }
//    });
//    return result;
    
    for(var i=0, size = this.contentFors.length; i < size ; ++i){
    	if(this.contentFors[i].getName() == name){
    		return this.contentFors[i];/////////////////////// EARLY EXIT /////////////////////////////
    	}
    }
    return null;
};

View.prototype.stringify = function(){
	
	// "plain properties" list
	var propList = [
	     'name', 
	     'def'
//	     , 'helperMethods'//DISABLE: this field is deprecated!
	];

	//Array-properties
	var arrayPropList = [
   	     'contentFors' //element type: ContentElement (stringify-able)
   	];

	//function for iterating over the property-list and generating JSON-like entries in the string-buffer
	var appendStringified = mobileDS.parser.appendStringified;
	
	var sb = ['mobileDS.parser.restoreObject({ classConstructor: ["View"]', ','];
	
	appendStringified(this, propList, sb);
	
	//non-primitives array-properties with stringify() function:
	appendStringified(this, arrayPropList, sb, null, function arrayValueExtractor(name, arrayValue){
		
		var buf =['['];
		for(var i=0, size = arrayValue.length; i < size; ++i){
			buf.push(arrayValue[i].stringify());
			buf.push(',');
		}
		//remove last comma
		if(arrayValue.length > 0){
			buf.splice( buf.length - 1, 1);
		}
		buf.push(']');
		
		return buf.join('');
	});
	

	sb.push( 'initPublish: function(){ mobileDS.PresentationManager.getInstance().addView(this.getController(), this); }');
	sb.push(',');
	
	//TODO is there a better way to store the controller? -> by its contoller's name, and add a getter function...
	if(this['controller']){
		
		//getter/setter function for controller
		//  (NOTE: this init-function needs to be called before controller can be accessed!)
		sb.push( 'initController: function(){');

		// store controller-name:
		sb.push( ' var ctrlName = ');
		sb.push( JSON.stringify(this.getController().getName()) );
		
		// ... and the getter/setter code:
		sb.push( '; this.controller = mobileDS.ControllerManager.getInstance().getController(ctrlName); },' );
		
		
		//add initializer function
		//  (NOTE: needs to be called before controller or renderer can be accessed!)
		sb.push( 'init: function(){');
		sb.push( ' this.initController(); ' );
		sb.push( ' }' );
		
		//NOTE: need to add comma in a separate entry 
		//      (-> in order to not break the removal method of last comma, see below)
		sb.push( ',' );
	}
	
	//if last element is a comma, remove it
	if(sb[sb.length - 1] === ','){
		sb.splice( sb.length - 1, 1);
	}
	
	
	sb.push(' }, true);');
	return sb.join('');
};



/**
 * Gets an array of all helper methods. 
 * 
 * @deprecated helper methods must now explicitly called in template definition (using syntax <code>@helper(name,args)</code>)
 * 
 * @function getHelperMethods
 * @returns {Array} Array of all helper methods
 */
View.prototype.getHelperMethods = function(){
	return this.helperMethods;
};

/**
 * Executes all helper methods that were specified / referenced in the view; with **data** as parameter.
 * 
 * @deprecated helper methods must now explicitly called in template definition (using syntax <code>@helper(name,args)</code>)
 * 
 * @function executeHelperMethods
 * @param {Object} data Parameter to pass to the helper methods
 */
View.prototype.executeHelperMethods = function(data){
	for(var i=0, size = this.getHelperMethods().length; i < size ; ++i){
		this.controller.performHelper(this.getHelperMethods()[i], data);
    }
};
