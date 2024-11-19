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

class DeleteAllFilesCommand : FileCounterCommand
{
    
    fileprivate var _model: CameraModel
    fileprivate var _imageItems : Array<EdsDirectoryItemRef> = []
    override init(model: CameraModel) {
        _model = model
        super.init(model: model)
    }
    
    override func execute()->Bool {
        
        var fileCount = 0
        
        var dcim : EdsBaseRef? = nil
        var error = countImages(_model.getCameraObject()!, volumeIndex: _model.getSelectedVolume(), outCount: &fileCount, outItem : &dcim, outImageItems : &_imageItems )
        
        if (error == EdsError(EDS_ERR_OK)){
            _model.setStorageFileNum(fileCount) // Observer will notifiy the update
            
            if fileCount == 0
            {
                var event = CameraEvent( type:.close_PROGRESS, arg: 0 as AnyObject)
                let viewNotification = ViewNotification()
                viewNotification.viewNotificationObservers(&event)
                return true
            }
            
            // delete
            
            for fileIndex in 0..<fileCount{
                if (!_model.getFileDeleting()){
                    var event = CameraEvent(type: .close_PROGRESS, arg: 0 as AnyObject)
                    let viewNotification = ViewNotification()
                    viewNotification.viewNotificationObservers(&event)
                    return true
                }
                
                error = delete(Int(fileIndex))
                if (error != EdsError(EDS_ERR_OK)){
                    var event = CameraEvent(type: .close_PROGRESS, arg: 0 as AnyObject)
                    let viewNotification = ViewNotification()
                    viewNotification.viewNotificationObservers(&event)
                    return true
                }
                
                var event = CameraEvent( type:.file_DELETE_COMPLETED, arg: 0 as AnyObject)
                let viewNotification = ViewNotification()
                viewNotification.viewNotificationObservers(&event)
            }
        }
        else
        {
            var event = CameraEvent( type:.close_PROGRESS, arg: 0 as AnyObject)
            let viewNotification = ViewNotification()
            viewNotification.viewNotificationObservers(&event)
        }
        return true
    }
    
    func delete (_ index : Int)->EdsError{
        
        let item : EdsDirectoryItemRef? = _imageItems[index]
        
        let error = EdsDeleteDirectoryItem(item)
        if (error != EdsError(EDS_ERR_OK))
        {
            if(item != nil)
            {
                EdsRelease(item)
            }
        }
        return error
    }
}
