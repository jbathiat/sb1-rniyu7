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

class FocusBracketingData: NSObject {
    
    fileprivate var _version: EdsUInt32 = 1
    fileprivate var _focusBracketing: EdsUInt32 = 1
    fileprivate var _numberOfShots: EdsUInt32 = 1
    fileprivate var _focusIncrement: EdsUInt32 = 1
    fileprivate var _exposureSmoothing: EdsUInt32 = 1

    func setVersion(_ version: EdsUInt32)
    {
        _version = version
    }
    
    func version() -> EdsUInt32
    {
    return _version;
    }
 
    func setFocusBracketing(_ focusBracketing: EdsUInt32)
    {
        _focusBracketing = focusBracketing
    }
    
    func focusBracketing() -> EdsUInt32
    {
    return _focusBracketing;
    }
    
    func setNumberOfShots(_ numberOfShots: EdsUInt32)
    {
        _numberOfShots = numberOfShots
    }
    
    func numberOfShots() -> EdsUInt32
    {
    return _numberOfShots;
    }
    
    func setFocusIncrement(_ focusIncrement: EdsUInt32)
    {
        _focusIncrement = focusIncrement
    }
    
    func focusIncrement() -> EdsUInt32
    {
    return _focusIncrement;
    }
    
    func setExposureSmoothing(_ exposureSmoothing: EdsUInt32)
    {
        _exposureSmoothing = exposureSmoothing
    }
    
    func exposureSmoothing() -> EdsUInt32
    {
    return _exposureSmoothing;
    }
 
    
}
