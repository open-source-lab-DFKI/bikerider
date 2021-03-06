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

define([  'mmirf/core','mmirf/util/extend','mmirf/util/deferred'
        ,'mmirf/commonUtils','mmirf/engineConfig','mmirf/controllerManager','mmirf/presentationManager','mmirf/logger','module'
        ,'mmirf/modelManager'
	],
	/**
	 * The DialogManager gives access to the most commonly used functions of
	 * the framework.
	 *
	 * <p>
	 * On initialization, the DialogManager also creates the {@link mmir.DialogEngine}
	 * and returns it as the second argument of the {@link #init}() function's callback
	 * (or the Promise's triggered callbacks).
	 *
	 * In addition, the DialogEngine is exported as module <code>"mmirf/dialogEngine"</code> via
	 * RequireJS' <code>define()</code> function.
	 *
	 * @example
	 * //initialization of inputManager
	 * require('mmirf/dialogManager').init().then( function(dialogManagerInstance, dialogEngineInstance){
	 * 		//do something
	 * });
	 *
	 * @name mmir.DialogManager
	 * @static
	 * @class
	 *
	 * @requires mmir.ControllerManager
	 * @requires mmir.PresentationManager
	 * @requires mmir.ModelManager
	 *
     * @requires mmir.require
     * @requires mmir._define
     *
	 */
	function(
			mmir, extend, deferred,
			commonUtils, engineConfig, controllerManager, presentationManager, Logger, module
) {

	var _create = function(){
		
		//the next comment enables JSDoc2 to map all functions etc. to the correct class description
		/** @scope mmir.DialogManager.prototype */

		/**
		 * @private
		 * @type Function
		 *
		 * @see {@link mmir.DialogManager#getOnPageRenderedHandler}
		 * @see {@link mmir.DialogManager#setOnPageRenderedHandler}
		 *
		 * @memberOf mmir.DialogManager#
		 */
		var onPageRenderedFunc;
		
		var ctrlManager = controllerManager;
		var presentManager = presentationManager;
	
		/**
		 * @memberOf mmir.DialogManager#
		 */
		var _instance = {
	
			/** @scope mmir.DialogManager.prototype */
	
			/**
			 * This function raises an event.
			 *
			 * @function
			 * @param {String} eventName
			 * 				The name of the event which is to be raised
			 * @param {Object} [eventData] OPTIONAL
			 * 				Data belonging to the event
			 * @throws {Error} if this function is invoked while the internal
			 * 				   event/state engine (i.e. {@link mmir.DialogEngine}
			 * 				   is not initialized yet
			 * @public
			 * @memberOf mmir.DialogManager.prototype
			 */
			raise : function(eventName, eventData) {
				//NOTE the functional implementation will be set during initialization (see below #init())
				throw new Error('DialogEngine not initialized yet: '
						+'call mmir.dialog.init(callback) and wait for the callback.'
				);
			},
	
			/**
			 * This function performs an action of a controller by calling
			 * the method {@link mmir.ControllerManager#perform} of the
			 * {@link mmir.ControllerManager}
			 *
			 * @function
			 * @param {String}
			 *            ctrlName Name of the controller to which the
			 *            action belongs
			 * @param {String}
			 *            actionName Name of the action that should be
			 *            performed
			 * @param {Object}
			 *            data optional data that can be submitted to the
			 *            action
			 * @returns {Object} the return object of the performed action
			 * @public
			 */
			perform : function(ctrlName, actionName, data) {
	
				//@russa what is this for?
	//			var _data = {};
	//			_data.timestamp = new Date().getTime();
	//			_data.ctrl = ctrlName;
	//			_data.name = actionName;
	//			_data.args = data;
	
				// if(logger.isDebug()) logger.debug("going to perform ('" + ctrlName + "','" + actionName + "')");//debug
	
				return ctrlManager.perform(ctrlName, actionName, data);
			},
	
			/**
			 * This function performs an action of a helper-class for a
			 * controller by calling the method
			 * {@link mmir.ControllerManager#performHelper} of the
			 * {@link mmir.ControllerManager}
			 *
			 * @function
			 * @param {String}
			 *            ctrlName Name of the controller to which the
			 *            helper action belongs
			 * @param {String}
			 *            helper_method_name Name of the action that should
			 *            be performed by the helper
			 * @param {Object}
			 *            data optional data that can be submitted to the
			 *            action
			 * @returns {Object} the return object of the performed action
			 * @public
			 */
			performHelper : function(ctrlName, helper_method_name, data) {
	
				if (arguments.length > 3) {
	
					return ctrlManager.performHelper(
							ctrlName, helper_method_name, data, arguments[3]
					);
				}
				else {
	
					return ctrlManager.performHelper(
							ctrlName, helper_method_name, data
					);
				}
			},
	
			/**
			 * This function displays a dialog of a controller by calling
			 * the method {@link mmir.PresentationManager#showDialog} of the
			 * {@link mmir.PresentationManager}
			 *
			 * @function
			 * @param {String}
			 *            ctrlName Name of the controller to which the
			 *            dialog belongs
			 * @param {String}
			 *            dialogId Id of the dialog that should be displayed
			 * @param {Object}
			 *            data Optional data that can be submitted to the
			 *            dialog
			 * @public
			 */
			showDialog : function(ctrlName, dialogId, data) {
				presentManager.showDialog.apply(presentManager, arguments);
			},
	
			/**
			 * This function closes a dialog of a controller by calling the
			 * method {@link mmir.PresentationManager#hideCurrentDialog} of
			 * the {@link mmir.PresentationManager}
			 *
			 * @function
			 * @public
			 */
			hideCurrentDialog : function() {
				presentManager.hideCurrentDialog.apply(presentManager, arguments);
			},
			/**
			 * Shows a "wait" dialog, indicating work-in-progress.
			 *
			 * This is a shortcut for calling
			 * {@link mmir.PresentationManager#showWaitDialog}
			 * (see documentation in <code>PresentationManager</code>
			 *  for parameters).
			 *
			 * @function
			 *
			 * @public
			 *
			 * @see mmir.PresentationManager#showWaitDialog
			 * @see mmir.PresentationManager#hideWaitDialog
			 */
			showWaitDialog : function(text, theme) {
				presentManager.showWaitDialog.apply(presentManager, arguments);
			},
	
			/**
			 * Hides / closes the "wait" dialog.
			 *
			 *
			 * This is a shortcut for calling
			 * {@link mmir.PresentationManager#hideWaitDialog}
			 * (see documentation in <code>PresentationManager</code>
			 *  for parameters).
			 *
			 * @function
			 * @public
			 *
			 * @see mmir.PresentationManager#hideWaitDialog
			 * @see mmir.PresentationManager#showWaitDialog
			 */
			hideWaitDialog : function() {
				presentManager.hideWaitDialog.apply(presentManager, arguments);
			},
	
			/**
			 * This function displays a view of a controller by calling the
			 * method {@link mmir.PresentationManager#renderView} of the
			 * {@link mmir.PresentationManager}.
			 * <br>
			 * And after rendering, the function set via #setOnPageRenderedHandler will
			 * called in context of the controller instance with arguments:
			 * <code>Controller.onPageRenderedFunc(ctrlName, viewName, data)</code>
			 *
			 *
			 * @function
			 * @param {String}
			 *            ctrlName Name of the controller to which the view
			 *            belongs
			 * @param {String}
			 *            viewName Name of the view that should be rendered
			 * @param {Object}
			 *            data Optional data that can be submitted to the
			 *            generation of the view
			 * @returns {void|Promise}
			 * 			if void/undefined is returned, the view is rendered synchronously, i.e.
			 * 			the view is rendered, when this method returns.
			 * 			If a Promise is returned, the view is rendered asynchronously
			 * 			(rendering is finished, when the promise is resolved)
			 *
			 * @public
			 */
			render : function(ctrlName, viewName, data) {
	
				var defer = presentManager.render(ctrlName, viewName, data);
	
				if (typeof onPageRenderedFunc === 'function') {
					var ctrl = ctrlManager.get(ctrlName);
					if(defer){
						defer.then(function(){
							onPageRenderedFunc.call(ctrl, ctrlName, viewName, data);
						});
					} else {
						onPageRenderedFunc.call(ctrl, ctrlName, viewName, data);
					}
				}
	
				return defer;
			},
			/**
			 * Get the current on-page-rendered hook function (if it was
			 * set).
			 *
			 * @function
			 * @param {Function}
			 *            the onPageRendered handler (NOTE: this may not be
			 *            set, i.e. <tt>undefined</tt>)
			 */
			getOnPageRenderedHandler : function() {
				return onPageRenderedFunc;
			},
			/**
			 * Set the on_page_loaded callback function.
			 *
			 * If <code>onPageRenderedHook</code> is a function object, it
			 * will be executed after a view is rendered and after the
			 * view's controller on_page_load function(s) has/have been
			 * executed.
			 *
			 * <p>
			 * This function will be executed after the view's
			 * on_page_load()-function.<br>
			 * The <code>onPageRenderedHook</code> function takes 3
			 * arguments that refer to the parameters with which the
			 * render-function was invoked: <br>
			 * <code>{String} ctrlName </code> Name of the controller to
			 * which the view belongs <br>
			 * <code>{String} viewName</code> Name of the view that should
			 * be rendered <br>
			 * <code>{Object} [data]</code> <em>Optional</em> data that
			 * can be submitted to the generation of the view
			 *
			 * @function
			 * @param {Function}
			 *            onPageRenderedHook a callback function that will
			 *            be executed after a view was rendered i.e. after a
			 *            page was loaded.
			 */
			setOnPageRenderedHandler : function(onPageRenderedHook) {
				onPageRenderedFunc = onPageRenderedHook;
			},
			_setControllerManager: function(ctrlManager){
				ctrlManager = ctrlManager;
			},
			_setPresentationManager: function(presentManager){
				presentManager = presentManager;
			}
	
		};//END: _instance = {...
		
		var inst = extend(_instance, {

			init : function(isRegisterEngine) {
				
				isRegisterEngine = isRegisterEngine !== false;
	
	//			delete this.init;
	
				//"read" settings from requirejs' config (see mainConfig.js):
				var url = module.config().scxmlDoc;
				var mode = module.config().mode;
	
				//create a SCION engine:
				var engine = engineConfig(url, mode);
	
				this._log = Logger.create(module);
				engine._logger = Logger.create(module.id+'Engine', module.config().logLevel);
	
	//			var _self = this;
	
				var theDeferredObj = deferred();
	
				engine.load().then(function(engine) {
	
					inst.raise = function raise(){
						engine.raise.apply(engine, arguments);
					};
	
//					delete engine.gen;
	
					if(isRegisterEngine){
						//register the DialogeEngine with requirejs as module 'mmirf/dialogEngine':
						mmir._define('mmirf/dialogEngine', function(){
							return engine;
						});
						//immediately load the module-definition:
						mmir.require(['mmirf/dialogEngine'], function(){
							//signal end of initialization process:
							theDeferredObj.resolve({manager: inst, engine: engine});
						});
					} else {
						//signal end of initialization process:
						theDeferredObj.resolve({manager: inst, engine: engine});
					}
				});
	
				return theDeferredObj;
	
			},//END: init()
			_create: _create
	
		});//END $.extend(...
		
		return inst;
	};
	
	return _create();

});//END: define(...
