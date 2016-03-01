OpenAPI Gateway 规格
================================================================================

OpenAPI Gateway 用于两个方向的代理：

* 为设备提供反向代理，允许网络应用以 HTTP 的形式调用设备中的功能；
* 为设备提供代理，允许设备以 AllJoyn 的形式调用 RESTFul 网络服务。

与此同时，OpenAPI Gateway 还提供网络服务的服务发现机制，用于寻找实际调用的服务器地址。

AllJoyn to HTTP 转换规则
--------------------------------------------------------------------------------

在代理调用过程中，需要对协议报文进行转换。转换的规则如下

Alljoyn   | HTTP
--------- | ---------------------------------
interface | host
path      | path
member    | method（GET / PUT / POST / DELETE）

body 中的参数会被转换为 json

对外接口
--------------------------------------------------------------------------------

OpenAPI Gateway 提供两种接口：

* HTTP 接口，用于设备反向代理功能与 Web 服务注册
* RabbitMQ RPC，用于网络服务代理调用

### Web 服务代理接口（RabbitMQ PRC）

代理调用一个 Web 服务。接受 AllJoyn 的 METHOD_CALL 方法的参数，转换为 http 的参数进行调用。

* request queue: service_proxy

#### 参数

#### 返回值



### 设备功能反向代理接口（HTTP）: POST /device/proxy

代理调用设备功能。根据转换规则拼装报文。

#### 参数

root：

key     | value  | description
------- | ------ | -------------------
target  | object | 调用的目标。参考下面的说明
payload | object | 具体的请求参数。是个 JSONObject

target：

key        | value  | description
---------- | ------ | --------------------
sipAccount | string | 设备网关在 IMS 服务注册的 帐号
busName    | string | 根据帐号获取的 busName。需要利用其他接口查询
path       | string | 被调用方法的对象路径
interface  | string | 被调用方法的 interface
member     | string | 被调用方法的方法名


### 服务接入接口（HTTP）: PUT /service/{serviceName}/instance

第三方的服务通过这个接口告知 OAG，服务实例的地址

#### 参数

path：

key         | value  | description
----------- | -----  | -----------
serviceName | string | 在 SSS 系统中注册的服务名称

body：

key     | value  | description
------- | -----  | -----------
address | string | 服务 IP 地址
port    | string | 服务端口号

### 服务实例变更通知

当服务接入接口被调用时，触发该通知。

* exchange name: dsb_exchange
* exchange type: topic
* routing key: status.instance.{serviceName}

消费接口
--------------------------------------------------------------------------------

### Exchage

rpc：
* 设备反向代理接口：device_reverse_proxy

topic：
* 设备状态更新接口：status.gateway.{sipAccount}
