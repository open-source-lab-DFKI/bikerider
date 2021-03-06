import {LanguageManager, InputManager, MediaManager, SemanticInterpreter} from 'mmir';
import {ChangeDetectorRef, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AppReadingOptions , AppStopReadingOptions, AppReadingShowOptions } from './speech/SpeechData';
import { isPromptId, PromptType } from './speech/PromptUtils';

import {
  MmirProvider,
  VoiceUIProvider,
  IonicDialogManager,
  IonicMmirModule,
  PromptReader,

  RecognitionEmma , UnderstandingEmma , ShowSpeechStateOptions, SpeechFeedbackOptions,

} from '../providers/mmir';

import { AppCmd } from '../models/speech/SpeechCommand';
import { SubscriptionUtil } from '../providers/mmir/util/SubscriptionUtil';
import { SpeechEventName } from '../providers/mmir/typings/mmir-ionic.d';
import { PromptHandler } from './speech/PromptHandler';
import { UnderstandigResult } from '../providers/mmir/typings/mmir-base-dialog.d';

export class MmirPage implements OnInit, OnDestroy {

  protected _mmirProvider: MmirProvider<AppCmd>;

  protected mmir: IonicMmirModule<AppCmd>;
  protected ref: ChangeDetectorRef;

  protected _lang: LanguageManager;
  protected _inp: InputManager;
  protected _dlg: IonicDialogManager<AppCmd>;
  protected _media: MediaManager;
  protected _semantic: SemanticInterpreter;

  protected prompt: PromptReader;

  protected isActiveView = false;

  protected get lang(): LanguageManager {
    if(!this._lang){
      if(this.mmir && this.mmir.lang){
        this._lang = this.mmir.lang;
      } else {
        return null;
      }
    }
    return this._lang;
  }

  protected get inp(): InputManager {
    if(!this._inp){
      if(this.mmir && this.mmir.input){
        this._inp = this.mmir.input;
      } else {
        return null;
      }
    }
    return this._inp;
  }

  protected get dlg(): IonicDialogManager<AppCmd> {
    if(!this._dlg){
      if(this.mmir && this.mmir.dialog){
        this._dlg = this.mmir.dialog;
      } else {
        return null;
      }
    }
    return this._dlg;
  }

  protected get media(): MediaManager {
    if(!this._media){
      if(this.mmir && this.mmir.media){
        this._media = this.mmir.media;
      } else {
        return null;
      }
    }
    return this._media;
  }

  protected get semantic(): SemanticInterpreter {
    if(!this._semantic){
      if(this.mmir && this.mmir.semantic){
        this._semantic = this.mmir.semantic;
      } else {
        return null;
      }
    }
    return this._semantic;
  }

  protected _asrActive: boolean = false;
  protected _isInit: boolean = false;
  protected _isDestroyed: boolean = false;

  protected _debugMsg: boolean = true;

  public get asrOn(){ return this._asrActive; }
  public get ttsOn() { return this.prompt? this.prompt.active : false; }

  protected _speechEventSubscriptions: Map<SpeechEventName, Subscription>;

  constructor(
    protected vuiCtrl: VoiceUIProvider<AppCmd>,
    mmirProvider: MmirProvider<AppCmd>,
    changeDetectorRef: ChangeDetectorRef
  ) {
    this._mmirProvider = mmirProvider;
    this.mmir = this._mmirProvider.mmir;
    this.ref = changeDetectorRef;

    vuiCtrl.ready().then(() => {
      this.prompt = vuiCtrl.prompt;
      this.prompt.handler = new PromptHandler();
    });
  }

  public ionViewCanEnter() {
    this.isActiveView = true;
    this._mmirProvider.ready().then( () => {
      if(this.isActiveView === false){
        return;
      }
      const subsUtil = new SubscriptionUtil(this.mmir);
      this._speechEventSubscriptions = subsUtil.subscribe([
        'showSpeechInputState',
        'changeMicLevels',
        'showDictationResult',
        'determineSpeechCmd',
        'execSpeechCmd',
        'cancelSpeechIO',
        'read',
        'stopReading',
        'showReadingStatus'//;
        //'resetGuidedInputForCurrentControl' , 'startGuidedInput' , 'resetGuidedInput' , 'isDictAutoProceed'
      ], this);
    });
    return true;
  }

  public ionViewCanLeave() {

    this.isActiveView = false;
    this._speechEventSubscriptions.forEach(subs => subs.unsubscribe());
    return true;
  }

  public handleClick(event, name, data?){

    this.triggerTouchFeedback();

		// this.inp.raise('touch_input_event');
		// this.inp.raise('click_on_' + name, data);
    let emmaEvt = this.dlg._emma.toEmma(event, data);
    this.dlg._emma._setEmmaFuncData(emmaEvt, 'understanding', {
      name: name,
      data: data
    });
    // this.dlg._emma.addTarget(emmaEvt, name, true);
    // this.dlg._emma.addProperty(emmaEvt, 'data', data, true);
    if(this._debugMsg) console.log(emmaEvt);
    this.inp.raise('touch', emmaEvt);
  }

  public localize(res: string) : string {
    if(this.lang){
      return this.lang.getText(res);
    } else {
      //if(this._debugMsg) console.info('mmir.LanguageManager not ready yet...');
      return '';
    }
  }

  public evalSemantics(asr_result: string, emmaEvent: RecognitionEmma){//TODO use emma-recognition event as input

    this.semantic.interpret(asr_result, null, result => {

      // let semantic;
      // if(result.semantic) {
      //   semantic = result.semantic;
      //   semantic.phrase = asr_result;
      //   if(this._debugMsg) console.log("semantic : " + result.semantic);//DEBUG
      // }
      // else {
      //
      //   //create "no-match" semantic-object:
      //   semantic = {
      //     "NoMatch": {
      //       "phrase": asr_result
      //     }
      //   };
      // }
      // this.dlg._emma._setEmmaFuncData(emmaEvent, 'understanding', semantic);
      // this.inp.raise('speech', emmaEvent);

      if(!result.semantic){

        result = {
          semantic: {type: 'nomatch'},// -> NoMatch
          phrase: asr_result
        };

      }

      const targetId = emmaEvent.interpretation.target || 'speech-cmd-btn';
      const cmdEvent = this.dlg._emma.toEmma({type: 'speech', mode: 'command', target: targetId}, result);
      this.inp.raise('speech', cmdEvent);

    });

  }

  public triggerTouchFeedback(){
    this.vuiCtrl.ctrl.triggerTouchFeedback({type: 'click'});
  }

  protected getPageId(): string {
    return this.constructor.name;
  }

  ////////////////////////////////////////// Speech IO ////////////////////////

  public microClicked(event, btnId: string){

    event.preventDefault();

    //if(this._debugMsg) console.log('microClicked');

    if(this.prompt.active){
      this.prompt.cancel();
    }

    // if(!isSyntheticClick(event))//TODO detect programatically triggered invocations of this function?
    this.triggerTouchFeedback();

    this.dlg.raise('toggleSpeechInputState', {mode: 'command', targetId: btnId});
	  this.dlg.raise('showSpeechState');
  }


  public ttsClicked(event){

    event.preventDefault();

    if(this.asrActive()){
      this.asrCancel();
    }

    if(this.prompt.active){
      this.prompt.cancel();
    }
    // else {
    //   this.read(defaultPrompt);
    // }
  }

  public asrActive(isActive?: boolean) : boolean {

    if(typeof isActive !== 'undefined'){

      if(this._asrActive !== isActive){

        this._asrActive = isActive;
        if(this._debugMsg) console.log('set asr active -> '+this._asrActive);//DEBUG
        this.detectChanges();

        // if(!isActive){
        //
        //   this.hideAsr();
        //
        //   // //WARNING: currently, TTS-request are not queued, but discared if TTS is already active
        //   // //         if that should change, this invocation needs to be adjusted too!
        //   // this.readResults();
        // } else {
        //
        //   this.showAsr('Spracheingabe gestartet...');
        // }
      }
    }

    return this._asrActive;
  };

  public asrCancel(){
    this.vuiCtrl.asrCancel();
    this._asrActive = false;
  }

  ////////////////////////////////////////// Speech Feedback Handler ////////////////////////

  protected showSpeechInputState(options: ShowSpeechStateOptions): void {
    if(this._debugMsg) console.log('showSpeechInputState -> ', options);
    this._asrActive = options.state;
    this.detectChanges();
  };

  protected showReadingStatus(options: AppReadingShowOptions): void {
    if(this._debugMsg) console.log('showReadingStatus -> ', options);
    if(this.prompt){
      this.prompt.setActive(options.active);
      this.detectChanges();
    }
  };

  /**
   * If <code>options.isStart === true</code>:
   * Called when GUI should show indicator for Microphone input levels.
   *
   * This should also initialize/start listening to mic-levels changes, e.g.
   * register a listener:
   * <pre>
   * mmir.MediaManager.on('miclevelchanged', miclevelsChandeHandler);
   * </pre>
   * where miclevelsChandeHandler:
   *    function(micLevel: number)
   *
   *
   * If <code>options.isStart === false</code>:
   * Called when GUI should hide/deactivate indicator for Microphone input levels.
   *
   * This should destroy/free resource that were set up for visualizing mic-level
   * changes, e.g. could stop listening to mic-level changes, i.e. unregister listener:
   * <pre>
   * mmir.MediaManager.off('miclevelchanged', miclevelsChandeHandler);
   * </pre>
   *
   * @param {SpeechFeedbackOptions} options
   *              the data specifying the (changed) speech input state etc.
   */
  protected changeMicLevels(options: SpeechFeedbackOptions): void{
    if(this._debugMsg) console.log('changeMicLevels -> ', options);
  };

  ////////////////////////////////////////// Speech Input Event Handler ////////////////////////

  /**
   * Called for processing dictated text.
   *
   * E.g. text could  be visualized/shown in GUI, and/or stored internally etc.
   *
   * @param  {RecognitionEmma} emma the EMMA event contain an ASR result(s) from
   *                                 speech recognition.
   */
  protected showDictationResult(asrEmmaEvent: RecognitionEmma): void {
    if(this._debugMsg) console.log('showDictationResult -> ', asrEmmaEvent);
  }

  /**
   * Called for determining the understanding of an ASR result.
   *
   * E.g. apply a grammar to the ASR text, or keyword spotting, or some other
   * kind of "natural language understanding" (NLU).
   *
   * With the NLU result, this function should invoke
   * <pre>
   * InputManager.raise('speech', understandingResult);
   * </pre>
   * for the understood ASR, where understandingResult should have type UnderstandigResult.
   *
   * NOTE: for "not understood" ASR text, there could be a corresponding Command
   *       (i.e. calling InputManager.raise('speech', notUnderstoodCmd)) or some
   *       other form of feedback/processing should be triggered.
   *
   * @param  {RecognitionEmma} emma the EMMA event contain an ASR result(s) from
   *                                 speech recognition.
   */
  protected determineSpeechCmd(asrEmmaEvent: RecognitionEmma): void {
    if(this._debugMsg) console.log('determineSpeechCmd -> ASR: ', asrEmmaEvent);
    const asr = this.dlg._emma._extractAsrData(asrEmmaEvent);
    if(asr && (asr.type === 'INTERMEDIATE' || asr.type === 'FINAL')){
      this.evalSemantics(asr.text, asrEmmaEvent);
    }
  }

  /**
   * Called for "applying" an understood command.
   *
   * This function should select the "best" command(s) from semanticEmmaEvent and
   * execute it/them.
   *
   * When selecting / before executing, it should be checked, if the commands can
   * actually be executed.
   *
   * If no "best" command can be selected/executed, this function should instead invoke
   * a diambiguation dialog (when there are some potential, but no clear command candiates)
   * or a feedback should be triggerd, stating that there was no corresponding command
   * found for the user input.
   *
   * @param  {semanticEmmaEvent} emma the EMMA event contain an understanding result with a list
   *                                    understood Cmd(s)
   */
  protected execSpeechCmd(semanticEmmaEvent: UnderstandingEmma<AppCmd>): void {
    if(this._debugMsg) console.log('execSpeechCmd -> ', semanticEmmaEvent);
    const cmd: UnderstandigResult<AppCmd> = this.dlg._emma._extractEmmaFuncData(semanticEmmaEvent, 'understanding');
    if(this._debugMsg) console.log('execSpeechCmd -> COMMAND: ', cmd);
    if(cmd){
      let sentences: Array<string>;
      if(cmd && Array.isArray(cmd.nlu) && cmd.nlu.length > 0 && cmd.nlu[0].semantic.type !== 'nomatch'){
        //TODO evaluate all commands
        sentences = cmd.nlu.map(cmd => cmd.preproc);
      } else {
        sentences = [this.lang.getText('did_not_understand_msg')];
        if(cmd && Array.isArray(cmd.nlu) && cmd.nlu.length > 0){
          sentences.push(this.lang.getText('command') + ': ' + cmd.nlu[0].preproc);
        }
      }
      this.vuiCtrl.readPrompt({contextId: this.getPageId(), readingId: PromptType.PROMPT_ERROR, readingData: {promptText: sentences}});
    }
  };

  /**
   * Called when speech input (ASR; recogintion) AND speech output (TTS; synthesis)
   * should be stopped.
   */
  protected cancelSpeechIO(): void {
    if(this._debugMsg) console.log('cancelSpeechIO -> ()');
    this.vuiCtrl.cancel();
  };

  ////////////////////////////////////////// Speech Output Event Handlers ///////////////////////

  /**
   * Called when text should should be read.
   *
   * When reading starts, the function must trigger the "reading-started" event:
   *
   * <pre>
   * mmir.DialogManager.raise('reading-started')
   * </pre>
   *
   * After reading the text (or an error occured, preventing to read the text),
   * the function must trigger the "reading-stopped" event:
   *
   * <pre>
   * mmir.DialogManager.raise('reading-stopped')
   * </pre>
   *
   *
   * @param  {string|ReadingOptions} data the data for determining the text the should be read
   *                                      (if string: corresponds to the ReadingOptions.dialogId)
   *
   * @returns {void|boolean} if data.test === true, the function return TRUE, if the
   *                            reading-request is valid (e.g. if reading is context-sensitive)
   */
  protected read(data: string|AppReadingOptions): void | boolean {
    if(this._debugMsg) console.log('read -> ', data);
  };

  /**
   * Called when reading should be stopped / aborted.
   *
   * If reading is/was active and is stopped, the "reading-stopped" event must be
   * triggered:
   *
   * <pre>
   * mmir.DialogManager.raise('reading-stopped')
   * </pre>
   *
   * @param  {StopReadingOptions} data the data specifying, which TTS engine should be stopped
   */
  protected stopReading(options: AppStopReadingOptions): void {
    if(this._debugMsg) console.log('stopReading -> ', options);
    this.vuiCtrl.ttsCancel();
  };

  ///////////////////////////////////////////////////

  //HELPER for savely requesting Angular to detect changes
  protected detectChanges(){
    if(this._isInit && ! this._isDestroyed){
      this.ref.detectChanges()
    }
  }

  ngOnInit(){
    this._isInit = true;
  }

  ngOnDestroy(){
    this._isDestroyed = true;
    // this.asrCancel();;
    // this.prompt.cancel();
  }
}
