// 禁用双击缩放和双指缩放的JavaScript脚本
// 修改版：保留基本功能，移除可能导致卡顿的事件监听
(function() {
    // 只保留对gesturestart事件的监听，防止极端情况下的缩放
    document.addEventListener('gesturestart', function(event) {
        // 仅在必要时阻止默认行为，减少对用户体验的干扰
        if (event.scale !== 1) {
            event.preventDefault();
        }
    }, { passive: false });
    
    // 移除了对touchstart, touchmove, touchend的监听，允许用户正常交互
    // 移除了对键盘事件的监听，允许用户使用键盘缩放
})(); 