<div>
    <div class="user-wrap">
        <ul class="user-list">
            <li class="user-item border-bt"><strong>百度账号</strong><span>{{passport_username}}</span></li>
            <li class="user-item border-bt" v-if="is_verified"><strong>姓名</strong><span>{{real_name}}</span><span class="user-verified">已认证</span><em class="user-ok"></em></li>
            <li class="user-item border-bt" v-else><strong>姓名</strong><span>{{real_name}}</span><span class="user-verified">未认证，去认证</span><em class="user-error"></em></li>
            <li class="user-item border-bt"><strong>手机号</strong><span>{{mobile}}</span></li>
            <li class="user-item border-bt"><strong>证件号</strong><span>{{certificate_no}}</span></li>
            <li class="user-item border-bt"><strong>推广区域</strong><span>{{city_name}}</span></li>
            <li class="user-item border-bt"><strong>推广联盟</strong><span>{{alliance_name}}</span></li>
        </ul>
    </div>
    <div class="user-login-wrap border-tp border-rt">
        <div class="user-login border-bt border-lt">
            <button type="button" class="" v-on:tap="loginClick">退出登录</button>
        </div>
    </div>
</div>