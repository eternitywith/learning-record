import { createVNode } from "./vnode"

export function createAppAPI(render) {
    return function createApp(rootComponent, rootProps){
        const app = {
            _props: rootProps,
            _component: rootComponent,
            _container: null,

            mount(container){
                // 1.根据组件创建虚拟节点
                // 2.虚拟节点和容器获取到后调用render进行渲染

                // 创建虚拟节点
                const vnode = createVNode(rootComponent, rootProps)

                // 调用render
                render(vnode, container)
                

                app._container = container
            }
        }
        return app
    }
}