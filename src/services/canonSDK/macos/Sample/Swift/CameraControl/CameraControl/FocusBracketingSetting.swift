/******************************************************************************
 *                                                                             *
 *   PROJECT : Eos Digital camera Software Development Kit EDSDK               *
 *                                                                             *
 *   Description: This is the Sample code to show the usage of EDSDK.          *
 *                                                                             *
 *                                                                             *
 *******************************************************************************
 *                                                                             *
 *   Written and developed by Canon Inc.                                       *
 *   Copyright Canon Inc. 2018 All Rights Reserved                             *
 *                                                                             *
 *******************************************************************************/

import Cocoa

class FocusBracketingSetting : NSWindowController, NSWindowDelegate, NSTextFieldDelegate{
    
    @IBOutlet weak var _focusIncrement: NSPopUpButton!
    
    @IBOutlet weak var _exposureSmoothingPop: NSPopUpButton!
    @IBOutlet weak var _focusBracketing: NSPopUpButton!
    
    @IBOutlet weak var _ok: NSButton!
    @IBOutlet weak var _cancel: NSButton!
    @IBOutlet weak var _numberOfShotsTextfield: NSTextField!
    
    fileprivate var _controller : CameraController!
    fileprivate var _model : CameraModel!
    fileprivate var edsFocusShiftSet:EdsFocusShiftSet = EdsFocusShiftSet()
    
    fileprivate var _versionPrev: Int32 = 1
    fileprivate var _focusShiftFunctionPrev: Int32 = 0
    fileprivate var _shootingNumberPrev: Int32 = 100
    fileprivate var _stepWidthPrev: Int32 = 4
    fileprivate var _exposureSmoothingPrev: Int32 = 0
    
    fileprivate var _version: Int32 = 1
    fileprivate var _focusShiftFunction: Int32 = 0
    fileprivate var _shootingNumber: Int32 = 100
    fileprivate var _stepWidth: Int32 = 4
    fileprivate var _exposureSmoothing: Int32 = 0
    
   // var FSSLIST: NSDictionary = NSMutableDictionary()
   // var ESLIST: NSDictionary = NSMutableDictionary()
    
    // FocusShiftFunction
    let PROPERTYLIST_2: NSDictionary = [
        0x00000000:"Disable",
        0x00000001:"Enable"
    ]
    
    
    // List of value and display name
    let PROPERTYLIST_1: NSDictionary = [
        NSNumber.init(value: 0x00000000 as EdsInt32): "Disable",
        NSNumber.init(value: 0x00000001 as EdsInt32): "Enable",
    ]
    
    // StepWidth
    let numStepWidth = [Int32](1...10)
    
    
    init(controller: CameraController) {
        super.init(window: nil)

        Bundle.main.loadNibNamed("FocusBracketingSetting", owner: self, topLevelObjects: nil)
        _controller = controller
        _model = _controller.getCameraModel()
        
        // FocusShiftSetting
        var fssData: EdsFocusShiftSet = EdsFocusShiftSet()
        EdsGetPropertyData(_model.getCameraObject(), EdsPropertyID(kEdsPropID_FocusShiftSetting), 0, UInt32(MemoryLayout<EdsFocusShiftSet>.size), &fssData)
        
        var strValue:String? = ""
        // Create list of combo box
        
        _focusBracketing.removeAllItems()
        _exposureSmoothingPop.removeAllItems()
        for i in 0..<PROPERTYLIST_1.count
        {
            strValue! = PROPERTYLIST_1[i] as! String
            _exposureSmoothingPop.addItem(withTitle: strValue!)
            _focusBracketing.addItem(withTitle: strValue!)
        }
        
        _focusIncrement.removeAllItems()
        for j in 0..<numStepWidth.count
        {
            strValue! = String(numStepWidth[j])
            _focusIncrement.addItem(withTitle: strValue!)
        }
        
        
        _focusShiftFunctionPrev = fssData.focusShiftFunction
        _shootingNumberPrev = fssData.shootingNumber
        _stepWidthPrev = fssData.stepWidth
        _exposureSmoothingPrev = fssData.exposureSmoothing
        
        // Select item of combo box
        var outString: String = ""
        outString = PROPERTYLIST_1[_focusShiftFunctionPrev] as! String
        _focusBracketing.selectItem(withTitle: outString)
        
        outString = PROPERTYLIST_1[_exposureSmoothingPrev] as! String
        _exposureSmoothingPop.selectItem(withTitle: outString)
        
        outString = String(_shootingNumberPrev)
        _numberOfShotsTextfield.stringValue = outString
        
        let index: Int = Int(_stepWidthPrev - 1)
        _focusIncrement.selectItem(at: index)
        
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    
    @IBAction func _focusBracketing(_ sender: Any) {
        let focusShiftFunction: Int32 = Int32(_focusBracketing.indexOfSelectedItem)
        _focusShiftFunction = focusShiftFunction
    }
           
    @IBAction func _focusIncrementPop(_ sender: Any) {
        let stepWidth: Int32 = Int32(_focusIncrement.indexOfSelectedItem)
        _stepWidth = stepWidth + 1
    }
    
    
    @IBAction func _exposureSmoothingPopUp(_ sender: Any) {
        let exposureSmoothing: Int32 = Int32(_exposureSmoothingPop.indexOfSelectedItem)
        _exposureSmoothing = exposureSmoothing
    }
         
    
    @IBAction func _okButton(_ sender: NSButton) {
        
        var strShotNum: String = ""
        strShotNum = _numberOfShotsTextfield.stringValue
        
        //_shootingNumber = Int32(strShotNum) ?? 100
        let shtNumInt = strShotNum
        if let shtNumInt = Int32(strShotNum){
            _shootingNumber = shtNumInt
            
            
            if isFrom2to999(num: Int(_shootingNumber))
            {
                edsFocusShiftSet.version = _version;
                edsFocusShiftSet.focusShiftFunction = _focusShiftFunction;
                edsFocusShiftSet.shootingNumber = _shootingNumber;
                edsFocusShiftSet.stepWidth = _stepWidth;
                edsFocusShiftSet.exposureSmoothing = _exposureSmoothing;
                
                EdsSetPropertyData(_model.getCameraObject(), EdsPropertyID(kEdsPropID_FocusShiftSetting), 0, UInt32(MemoryLayout<EdsFocusShiftSet>.size), &edsFocusShiftSet)
                
                self.close()
            }else {
                alert()
            }
            
        }else{
            alert()
        }
    }
    
    func isFrom2to999 (num: Int) -> Bool {
        if num >= 2 && num <= 999 {
            return true
        }
        return false
    }

    
    @IBAction func _cancelButton(_ sender: NSButton) {
        self.close()
    }

    func alert(){
        let alert: NSAlert = NSAlert()
        alert.messageText = "Please enter a number from 2 to 999 in the Number of shots field."
        alert.addButton(withTitle: "OK")
        alert.runModal()
    }
    
    func windowWillClose(_ notification: Notification) {
        NotificationCenter.default.removeObserver(self)
        NSApp.stopModal()
        NSApp.abortModal()
    }
}
