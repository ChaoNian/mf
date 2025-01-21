import React from 'react'
import Sliders from './Sliders'
// 加载远程组件 react.lazy 懒(动态)加载远程组件
/**
 * React.lazy、React.Suspense 是react的语法要求
 */
const RemoteNewsList = React.lazy(() => import('remote/NewsList'))
const App = () => {
    return (
        <div>
            <h2>
                轮播图Sliders
            </h2>
            <Sliders/>
            <h2>远程组件</h2>
            <React.Suspense fallback={<div>加载远程组件中。。。</div>}>
                <RemoteNewsList />
            </React.Suspense>
            <button onClick={() => {
                import('remote/click').then(module => {
                    console.log(module, 'modulemodule');
                    module.clickMe()
                })
            }}>
                点击
            </button>
        </div>
    )
}

export default App;