<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    class="form"
    label-width="100px">
    <el-card>
      <div slot="header">基础信息</div>
      <el-form-item
        prop="name"
        label="任务名称"
        class="w500">
        <el-input
          :disabled="see"
          v-model="form.name"
          :maxlength="30">
          <template slot="append">{{ form.name.length }}/30</template>
        </el-input>
      </el-form-item>
      <el-form-item
        v-if="+form.type!==2"
        prop="_time"
        label="任务时间"
        class="w500">
        <el-date-picker
          :disabled="see"
          v-model="form._time"
          :default-time="['00:00:00', '23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期" />
      </el-form-item>
      <!--<el-form-item
        prop="taskDesc"
        label="任务描述"
        class="w500">
        <el-input
          :disabled="see"
          v-model="form.taskDesc"
          :rows="3"
          maxlength="80"
          type="textarea" />
        <div>{{ form.taskDesc.length }}/80</div>
      </el-form-item>-->
      <el-form-item
        prop="type"
        label="任务类型"
        class="w500">
        <el-select
          :disabled="see"
          v-model="form.type"
          class="mb10"
          placeholder="请选择">
          <el-option
            v-for="(value, key) in taskType"
            :key="key"
            :value="key"
            :label="value" />
        </el-select>
      </el-form-item>
      <el-form-item
        prop="isAllow"
        label="导购二维码"
        class="w500">
        <el-radio-group
          v-model="form.isAllow"
          :disabled="see">
          <el-radio
            :label="0">关闭
          </el-radio>
          <el-radio
            :label="1">允许导购上传个人二维码进行分享
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="storeList"
        label="适用门店">
        <template v-if="storeListLength>0">已选{{ storeListLength }}家门店</template>

        <!--已选门店可查看，所以不允许被禁用-->
        <el-button
          type="text"
          size="mini"
          @click="isShowStore=true">
          {{ storeListLength>0?'修改':'添加' }}门店
        </el-button>
      </el-form-item>
    </el-card>
    <template v-if="+form.type === 1">
      <el-card
        v-for="(item,index) in form._fansRule"
        :key="index"
        class="mt10">
        <div
          slot="header"
          class="step">
          <div class="step-flex">
            <span>
              <span>任务详情 </span>
            </span>
            <span class="ui-color3">{{ taskType[form.type] }}</span>
          </div>
          <div
            v-if="index!==0 && !see"
            class="el-icon-delete"
            @click="delTask(index)" />
        </div>
        <el-form-item
          :prop="'_fansRule.'+ index + '.activityId'"
          :rules="rules.activityId"
          label="吸粉活动">
          <el-button
            type="text"
            icon="el-icon-plus"
            size="mini"
            @click="chooseActivity">选择活动
          </el-button>
          <span
            v-if="form._fansRule[0]&&form._fansRule[0].activityId"
            class="small">已选择 {{ selectedActivity.name }}</span>
        </el-form-item>
        <el-form-item
          :prop="'_fansRule.'+ index + '.fillNum'"
          :rules="rules.fillNum"
          label="任务完成条件"
          class="w350">
          <el-input
            :disabled="see"
            v-model.number="item.fillNum">
            <template slot="prepend">留资</template>
            <template slot="append">人</template>
          </el-input>
        </el-form-item>
        <!--因vue的就地复用策略，导致奖励的input编辑时为空，加key可以防止-->
        <el-form-item
          :key="1"
          :prop="'_fansRule.'+ index + '.reward'"
          :rules="rules.reward"
          label="任务奖励"
          class="w250">
          <el-input
            :disabled="see"
            v-model.number="item.reward">
            <template slot="append">金币</template>
          </el-input>
        </el-form-item>
      </el-card>
    </template>
    <template v-if="+form.type === 2">
      <el-card
        v-for="(item,index) in form._articleRule"
        :key="index"
        class="mt10">
        <div
          slot="header"
          class="step">
          <div class="step-flex">
            <span>
              <span>任务详情 </span>
              <span>（第 {{ index + 1 }} 步）</span>
            </span>
            <!--            <span class="ui-color3">{{ taskType[form.type] }}</span>-->
          </div>
          <template v-if="!see">
            <el-button
              v-if="index > 0"
              size="mini"
              type="text"
              @click="moveComponent(index, 1)">上移
            </el-button>
            <el-button
              v-if="index < form._articleRule.length - 1"
              size="mini"
              type="text"
              @click="moveComponent(index, -1)">下移
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="delTask(index)">删除
            </el-button>
          </template>
          <!--
          <div
            v-if="index!==0 && !see"
            class="el-icon-delete"
            @click="delTask(index)" />
-->
        </div>
        <el-form-item
          :prop="'_articleRule.'+ index + '._time'"
          :rules="rules._time"
          label="转发时间"
          class="w500">
          <el-date-picker
            :disabled="see"
            v-model="item._time"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item label="转发内容">
          <el-radio-group
            v-model="item.type"
            :disabled="see"
            @change="item.taskRangeList = []">
            <el-radio
              v-for="item in forwardType"
              :key="item.type"
              :label="item.type">{{ item.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="item.type===1">
          <el-form-item
            :prop="'_articleRule.'+ index + '.articleId'"
            :rules="rules.articleId"
            label="添加软文">
            <div>
              <el-button
                type="text"
                icon="el-icon-plus"
                size="mini"
                @click="chooseArticle(index)">选择软文
              </el-button>
              <span
                v-if="item.articleId"
                class="small">已选择 {{ item.title }}</span>
            </div>
          </el-form-item>
          <el-form-item
            :prop="'_articleRule.'+ index + '.shareDesc'"
            :rules="rules.shareDesc"
            label="分享描述"
            class="w500">
            <el-input
              :disabled="see"
              v-model="item.shareDesc"
              :rows="3"
              maxlength="80"
              type="textarea" />
            <div>{{ item.shareDesc.length }}/80</div>
          </el-form-item>
          <el-form-item
            :prop="'_articleRule.'+ index + '.shareImg'"
            :rules="rules.shareImg"
            label="分享配图"
            class="w500">
            <div class="goods">
              <el-input
                v-show="false"
                v-model="item.shareImg" />
              <img
                v-if="item.shareImg"
                :src="item.shareImg"
                alt=""
                class="goods-img"
                @click="chooseMaterial(index)">
              <div
                v-if="!item.shareImg"
                class="el-upload el-upload--picture-card"
                @click="chooseMaterial(index)">
                <i class="el-icon-plus" />
              </div>
            </div>
            <p class="ui-color3">建议尺寸为 750 x 750 像素</p>
          </el-form-item>
        </template>
        <template v-if="item.type===2">
          <el-form-item
            :prop="'_articleRule.'+ index + '.taskRangeList'"
            :rules="rules.taskRangeList"
            label="图片素材">
            <div class="img-list">
              <div
                v-background="item2.linkUrl"
                v-for="(item2, index2) in item.taskRangeList"
                :key="index2"
                class="img-item">
                <div class="sort-bar">
                  <!--<i
                    class="icons el-icon-caret-left"
                    @click="handleImgSort('prev', index2)" />-->
                  <i
                    class="icons el-icon-close"
                    @click="handleImgRemoveForwardType2(index2, index)" />
                    <!--<i
class="icons el-icon-caret-right"
@click="handleImgSort('next', index2)" />-->
                </div>
              </div>
            </div>
            <el-button
              type="text"
              icon="el-icon-plus"
              size="mini"
              @click="chooseMaterialForwardType2(index)">添加图片
            </el-button>
            <span class="small">已选择 {{ item.taskRangeList.length }}个图片，最多选择9个</span>
          </el-form-item>
          <el-form-item
            :prop="'_articleRule.'+ index + '.shareDesc'"
            :rules="rules.shareDesc"
            label="转发文字"
            class="w500">
            <el-input
              :disabled="see"
              v-model="item.shareDesc"
              :rows="3"
              maxlength="80"
              type="textarea" />
            <div>{{ item.shareDesc.length }}/80</div>
          </el-form-item>
        </template>
        <template v-if="item.type===3">
          <el-form-item
            :prop="'_articleRule.'+ index + '.taskRangeList'"
            :rules="rules.taskRangeList"
            label="视频素材">
            <div class="img-list">
              <div
                v-for="(item2, index2) in item.taskRangeList"
                :key="index2"
                class="img-item img-item_video">
                <video
                  :src="item2.linkUrl"
                  class="video"
                  controls />
                <div class="sort-bar">
                  <!--<i
                    class="icons el-icon-caret-left"
                    @click="handleImgSort('prev', index2)" />-->
                  <i
                    class="icons el-icon-close"
                    @click="handleImgRemoveForwardType3(index2, index)" />
                    <!--<i
class="icons el-icon-caret-right"
@click="handleImgSort('next', index2)" />-->
                </div>
              </div>
            </div>
            <el-button
              type="text"
              icon="el-icon-plus"
              size="mini"
              @click="chooseMaterialForwardType3(index)">添加视频
            </el-button>
          </el-form-item>
          <el-form-item
            :prop="'_articleRule.'+ index + '.shareDesc'"
            :rules="rules.shareDesc"
            label="转发文字"
            class="w500">
            <el-input
              :disabled="see"
              v-model="item.shareDesc"
              :rows="3"
              maxlength="80"
              type="textarea" />
            <div>{{ item.shareDesc.length }}/80</div>
          </el-form-item>
        </template>
        <template v-if="item.type===4">
          <el-form-item
            :prop="'_articleRule.'+ index + '.taskRangeList'"
            :rules="rules.taskRangeList"
            label="添加商品">
            <div>
              <el-button
                type="text"
                icon="el-icon-plus"
                size="mini"
                @click="chooseMaterialForwardType4(index)">选择商品
              </el-button>
              <span class="small">已选择 {{ item.taskRangeList.length }}个商品，最多选择9个</span>
            </div>
          </el-form-item>
          <el-form-item
            :prop="'_articleRule.'+ index + '.shareDesc'"
            :rules="rules.shareDesc"
            label="转发文字"
            class="w500">
            <el-input
              :disabled="see"
              v-model="item.shareDesc"
              :rows="3"
              maxlength="80"
              type="textarea" />
            <div>{{ item.shareDesc.length }}/80</div>
          </el-form-item>
        </template>
        <template v-if="item.type===5">
          <el-form-item
            :prop="'_articleRule.'+ index + '.taskRangeList'"
            :rules="rules.taskRangeList"
            label="添加优惠券">
            <div>
              <el-button
                type="text"
                icon="el-icon-plus"
                size="mini"
                @click="chooseMaterialForwardType5(index)">优惠券
              </el-button>
              <span class="small">已选择 {{ item.taskRangeList.length }}个优惠券，最多选择9个</span>
            </div>
          </el-form-item>
          <el-form-item
            :prop="'_articleRule.'+ index + '.shareDesc'"
            :rules="rules.shareDesc"
            label="分享描述"
            class="w500">
            <el-input
              :disabled="see"
              v-model="item.shareDesc"
              :rows="3"
              maxlength="80"
              type="textarea" />
            <div>{{ item.shareDesc.length }}/80</div>
          </el-form-item>
          <el-form-item
            :prop="'_articleRule.'+ index + '.shareImg'"
            :rules="rules.shareImg"
            label="分享配图"
            class="w500">
            <div class="goods">
              <el-input
                v-show="false"
                v-model="item.shareImg" />
              <img
                v-if="item.shareImg"
                :src="item.shareImg"
                alt=""
                class="goods-img"
                @click="chooseMaterial(index)">
              <div
                v-if="!item.shareImg"
                class="el-upload el-upload--picture-card"
                @click="chooseMaterial(index)">
                <i class="el-icon-plus" />
              </div>
            </div>
            <p class="ui-color3">建议尺寸为 600 x 480 像素</p>
          </el-form-item>
        </template>
        <template v-if="item.type===7">
          <el-form-item
            :prop="'_articleRule.'+ index + '.taskRangeList'"
            :rules="rules.taskRangeList"
            label="添加砍价">
            <div>
              <el-button
                type="text"
                icon="el-icon-plus"
                size="mini"
                @click="chooseMaterialForwardType7(index)">砍价
              </el-button>
              <span class="small">已选择 {{ item.taskRangeList.length }}个砍价，最多选择9个</span>
            </div>
          </el-form-item>
          <el-form-item
            :prop="'_articleRule.'+ index + '.shareDesc'"
            :rules="rules.shareDesc"
            label="分享描述"
            class="w500">
            <el-input
              :disabled="see"
              v-model="item.shareDesc"
              :rows="3"
              maxlength="80"
              type="textarea" />
            <div>{{ item.shareDesc.length }}/80</div>
          </el-form-item>
          <el-form-item
            :prop="'_articleRule.'+ index + '.shareImg'"
            :rules="rules.shareImg"
            label="分享配图"
            class="w500">
            <div class="goods">
              <el-input
                v-show="false"
                v-model="item.shareImg" />
              <img
                v-if="item.shareImg"
                :src="item.shareImg"
                alt=""
                class="goods-img"
                @click="chooseMaterial(index)">
              <div
                v-if="!item.shareImg"
                class="el-upload el-upload--picture-card"
                @click="chooseMaterial(index)">
                <i class="el-icon-plus" />
              </div>
            </div>
            <p class="ui-color3">建议尺寸为 600 x 480 像素</p>
          </el-form-item>
        </template>
        <template v-if="item.type===8">
          <el-form-item
            :prop="'_articleRule.'+ index + '.taskRangeList'"
            :rules="rules.taskRangeList"
            label="添加瓜分券">
            <div>
              <el-button
                type="text"
                icon="el-icon-plus"
                size="mini"
                @click="chooseMaterialForwardType8(index)">瓜分券
              </el-button>
              <span class="small">已选择 {{ item.taskRangeList.length }}个瓜分券，最多选择9个</span>
            </div>
          </el-form-item>
          <el-form-item
            :prop="'_articleRule.'+ index + '.shareDesc'"
            :rules="rules.shareDesc"
            label="分享描述"
            class="w500">
            <el-input
              :disabled="see"
              v-model="item.shareDesc"
              :rows="3"
              maxlength="80"
              type="textarea" />
            <div>{{ item.shareDesc.length }}/80</div>
          </el-form-item>
          <el-form-item
            :prop="'_articleRule.'+ index + '.shareImg'"
            :rules="rules.shareImg"
            label="分享配图"
            class="w500">
            <div class="goods">
              <el-input
                v-show="false"
                v-model="item.shareImg" />
              <img
                v-if="item.shareImg"
                :src="item.shareImg"
                alt=""
                class="goods-img"
                @click="chooseMaterial(index)">
              <div
                v-if="!item.shareImg"
                class="el-upload el-upload--picture-card"
                @click="chooseMaterial(index)">
                <i class="el-icon-plus" />
              </div>
            </div>
            <p class="ui-color3">建议尺寸为 600 x 480 像素</p>
          </el-form-item>
        </template>
        <el-form-item
          :prop="'_articleRule.'+ index + '.reward'"
          :rules="rules.reward"
          label="任务奖励"
          class="w250">
          <el-input
            :disabled="see"
            v-model.number="item.reward">
            <template slot="append">金币</template>
          </el-input>
        </el-form-item>
      </el-card>
      <!--v-if="form._articleRule.length<5 && !see"-->
      <el-button
        v-if="!see"
        class="mt10"
        type="text"
        icon="el-icon-plus"
        size="mini"
        @click="addTask">继续添加任务
      </el-button>
    </template>
    <template v-if="+form.type === 3">
      <el-card
        class="mt10">
        <div
          slot="header"
          class="step">
          <div class="step-flex">
            <span>
              <span>任务详情 </span>
            </span>
            <span class="ui-color3">{{ taskType[form.type] }}</span>
          </div>
        </div>
        <el-form-item
          prop="_kpiRangeList"
          label="业绩计算范围">
          <div>
            <el-button
              type="text"
              icon="el-icon-plus"
              size="mini"
              @click="chooseGoods">选择商品
            </el-button>
            <span
              v-if="taskRangeListGoods.length"
              class="small">已选择{{ taskRangeListGoods.length }}件商品</span>
          </div>
          <div>
            <el-button
              type="text"
              icon="el-icon-plus"
              size="mini"
              @click="chooseGroup">选择拼团
            </el-button>
            <span
              v-if="taskRangeListGroup.length"
              class="small">已选择{{ taskRangeListGroup.length }}个拼团活动</span>
          </div>
        </el-form-item>
        <el-row
          v-for="(item,index) in form._kpiRule"
          :key="index"
          type="flex"
          align="middle"
          justify="start">
          <el-form-item
            :prop="'_kpiRule.'+ index + '.amount'"
            :rules="rules.amount"
            :label="index===0?'业绩目标':''"
            class="w350">
            <el-input
              :disabled="see"
              v-model="item.amount">
              <template slot="prepend">达成目标</template>
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item
            :prop="'_kpiRule.'+ index + '.reward'"
            :rules="rules.reward"
            label=""
            class="w350 kpi-reward">
            <el-input
              :disabled="see"
              v-model.number="item.reward">
              <template slot="prepend">奖励</template>
              <template slot="append">金币</template>
            </el-input>
          </el-form-item>
          <div
            v-if="index!==0 && !see"
            class="el-icon-delete kpi-del"
            @click="delKpi(index)" />
          <el-button
            v-if="index===0 && !see && form._kpiRule.length<3"
            class="kpi-target"
            type="text"
            icon="el-icon-plus"
            size="mini"
            @click="addKpi">新增目标
          </el-button>
        </el-row>
        <el-form-item
          label="业绩排名">
          <el-row type="flex">
            <el-select
              v-model="kpiRank1"
              placeholder="请选择">
              <el-option
                v-for="item in kpiRankData1"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
            <el-select
              v-model="kpiRank2"
              class="ml10"
              placeholder="请选择">
              <el-option
                v-for="item in kpiRankData2"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-row>
        </el-form-item>
      </el-card>
    </template>

    <div class="ui-edit-btn-wrapper">
      <el-button
        v-if="see"
        type="primary"
        @click="$router.go(-1)">确定
      </el-button>
      <template v-else>
        <el-button
          @click="$router.go(-1)">取消
        </el-button>
        <el-button
          :loading="submitting"
          type="primary"
          @click="submit">保存
        </el-button>
      </template>
    </div>
    <!--门店选择，多选-->
    <select-store-tree
      :is-disabled-all="see"
      :visible.sync="isShowStore"
      :default-value="form.storeList"
      @confirm="confirmCheckedStore"
    />
    <!--图片库-->
    <material-selector
      :when-show-clear-selected="true"
      :is-multi="false"
      :visible.sync="showMaterialSelector"
      @change="(val) => materialSelectorChange(val)" />
    <!--活动选择-->
    <ActivitySelector
      :is-fill="1"
      :visible.sync="isShowActivityDialog"
      :selected-ids="[form._fansRule[0].activityId]"
      @change="activitySelectorChange" />
    <!--文章选择-->
    <ArticleSelector
      :visible.sync="isShowArticleDialog"
      :selected-ids="[form._articleRule[chooseArticleIndex].articleId]"
      @change="articleSelectorChange" />
    <!--拼团选择-->
    <GroupSelector
      :visible.sync="isShowGroupDialog"
      :selected-ids="taskRangeListGroup"
      :is-multiple="true"
      @change="groupSelectorChange" />
    <!--商品选择，多选-->
    <goods-selector
      v-if="isShowGoodsDialog"
      :visible.sync="isShowGoodsDialog"
      :manual-data="taskRangeListGoods"
      :hide-condition="true"
      :multiple="true"
      type="manual"
      @change="goodsSelectorChange" />
    <!--转发图片-->
    <material-selector
      :is-multi="true"
      :visible.sync="showMaterialSelectorForwardType2"
      :default-value="form._articleRule[shareImgIndexForwardType2].taskRangeList.map(v=>({id:v.activityId}))"
      @change="(val) => materialSelectorChangeForwardType2(val)" />
    <!--转发视频-->
    <material-selector
      :is-multi="false"
      :visible.sync="showMaterialSelectorForwardType3"
      :default-value="form._articleRule[shareImgIndexForwardType3].taskRangeList.map(v=>({id:v.activityId}))"
      type="video"
      @change="(val) => materialSelectorChangeForwardType3(val)" />
    <!--转发商品-->
    <goods-selector
      v-if="showMaterialSelectorForwardType4"
      :visible.sync="showMaterialSelectorForwardType4"
      :manual-data="form._articleRule[shareImgIndexForwardType4].taskRangeList.map(v=>v.productId)"
      :hide-condition="true"
      :multiple="true"
      type="manual"
      @change="(val) => materialSelectorChangeForwardType4(val)" />
    <!--转发优惠券-->
    <coupon-selector
      v-if="showMaterialSelectorForwardType5"
      :visible.sync="showMaterialSelectorForwardType5"
      :multiple="true"
      :default-data="form._articleRule[shareImgIndexForwardType5].taskRangeList.map(v=>v.activityId)"
      @change="(val) => materialSelectorChangeForwardType5(val)" />
    <!--转发视频购物-->
    <!--砍价选择-->
    <BargainSelector
      v-if="showMaterialSelectorForwardType7"
      :visible.sync="showMaterialSelectorForwardType7"
      :is-multiple="true"
      :selected-ids="form._articleRule[shareImgIndexForwardType7].taskRangeList.map(v=>v.activityId)"
      @change="(val) => materialSelectorChangeForwardType7(val)" />
    <!--瓜分券选择-->
    <CouponSplitSelector
      v-if="showMaterialSelectorForwardType8"
      :visible.sync="showMaterialSelectorForwardType8"
      :is-multiple="true"
      :selected-ids="form._articleRule[shareImgIndexForwardType8].taskRangeList.map(v=>v.activityId)"
      @change="(val) => materialSelectorChangeForwardType8(val)" />
  </el-form>
</template>

<script>
// import * as Validate from '@/utils/validate'
// import ApiProduct from '@/api/product'
import * as ApiTask from '@/api/task'
import * as ApiArticle from '@/api/article'
import ActivitySelector from '@/components/ActivitySelector'
import ArticleSelector from '@/components/ArticleSelector'
import GoodsSelector from '@/components/GoodsSelector'
import GroupSelector from '@/components/GroupSelector'
import BargainSelector from '@/components/BargainSelector'
import CouponSplitSelector from '@/components/CouponSplitSelector'
import SelectStoreTree from '@/components/SelectStoreTree'
import MaterialSelector from '@/components/MaterialSelector'
import CouponSelector from '@/components/CouponSelector'
import * as Validate from '@/utils/validate'
import * as ApiActivity from '@/api/activity'
import { mapGetters } from 'vuex'

const getTaskItem2 = () => { // 软文
  return {
    _time: [],
    'type': 1, // 转发类型
    'taskRangeList': [], // 资源数据
    'articleId': null, // 文章id
    'beginTime': '', // 开始时间
    'endTime': '', // 结束时间
    'linkUrl': '', // 添加转发链接
    'shareDesc': '', // 分享描述
    'shareImg': '' // 分享图片
  }
}

const getTaskItem1 = () => { // 吸粉
  return {
    'activityId': null, // 活动id
    'fillNum': '', // 留资人数
    'reward': '' // 奖励
  }
}

const getTaskItem3 = () => { // 业绩
  return {
    'amount': '', // 金额
    'reward': '' // 奖金
  }
}

const getDefaultForm = () => {
  return {
    _time: [],
    'beginTime': '', // 开始时间
    'endTime': '', // 结束时间
    'id': 0,
    'isAllow': 0, // 导购二维码 0关闭 1允许导购上传二维码进行分享
    'name': '', // 任务名称
    'storeList': [],
    'type': '2', // 1吸粉 2文章 3业绩
    'taskDesc': '', // 描述
    'taskRuleList': [], // 任务列表
    // 以上是公共数据，以下是各个类型对应的数据。后端不处理。说明：下划线开头的数据。后端接收了也是不做处理的。放在form里。是因为要做表单验证。
    _kpiRank: '', // 业绩排行
    _kpiRange: '', // 业绩范围类型
    _kpiRangeList: [], // 业绩范围具体数据
    _fansRule: [getTaskItem1()], // 吸粉规则
    _articleRule: [getTaskItem2()], // 文章规格
    _kpiRule: [getTaskItem3()] // 业绩规则
  }
}

export default {
  name: 'Detail',
  components: {
    MaterialSelector,
    SelectStoreTree,
    ActivitySelector,
    ArticleSelector,
    GoodsSelector,
    GroupSelector,
    CouponSelector,
    BargainSelector,
    CouponSplitSelector
  },
  data () {
    return {
      forwardType: [
        {
          type: 1,
          name: '软文'
        },
        {
          type: 2,
          name: '图片'
        },
        {
          type: 3,
          name: '视频'
        },
        {
          type: 4,
          name: '商品'
        },
        {
          type: 5,
          name: '优惠券'
        },
        // {
        //   type: 6,
        //   name: '视频购物'
        // }
        {
          type: 7,
          name: '砍价'
        },
        {
          type: 8,
          name: '瓜分券'
        }
      ],
      selectedActivity: {}, // 已选择的商品数据
      kpiRankData1: [],
      kpiRankData2: [],
      kpiRank1: 0,
      kpiRank2: 1,
      isShowActivityDialog: false,
      isShowArticleDialog: false,
      isShowGoodsDialog: false,
      isShowGroupDialog: false,
      taskType: {
        '1': '吸粉',
        '2': '转发分享',
        '3': '业绩达成'
      },
      form: getDefaultForm(),
      taskRangeListGoods: [],
      taskRangeListGroup: [],
      shareImgIndex: 0,
      shareImgIndexForwardType2: 0,
      shareImgIndexForwardType3: 0,
      shareImgIndexForwardType4: 0,
      shareImgIndexForwardType5: 0,
      shareImgIndexForwardType7: 0,
      shareImgIndexForwardType8: 0,
      chooseArticleIndex: 0,
      rules: {
        taskRangeList: [{ required: true, message: '本项必填' }],
        shareImg: [{ required: true, message: '本项必填' }],
        shareDesc: [{ required: true, message: '本项必填' }],
        _time: [{ required: true, message: '本项必填' }],
        storeList: [{ required: true, message: '本项必填' }],
        name: [{ required: true, message: '本项必填', trigger: 'blur' }],
        activityId: [{ required: true, message: '本项必填' }],
        articleId: [{ required: true, message: '本项必填' }],
        fillNum: [
          { required: true, message: '本项必填', trigger: 'blur' },
          {
            validator: (rule, value, callback) => Validate.limitNumber(rule, value, callback, { min: 0 }),
            trigger: 'blur'
          }
        ],
        reward: [
          { required: true, message: '本项必填', trigger: 'blur' },
          {
            validator: (rule, value, callback) => Validate.limitNumber(rule, value, callback, { min: 0 }),
            trigger: 'blur'
          }
        ],
        amount: [
          { required: true, message: '本项必填', trigger: 'blur' },
          { validator: Validate.money, trigger: 'blur' }
        ],
        _kpiRangeList: [{ required: true, message: '本项必填' }]
      },
      see: false,
      isShowStore: false,
      showGoodsSelector: false,
      showMaterialSelector: false,
      showMaterialSelectorForwardType2: false,
      showMaterialSelectorForwardType3: false,
      showMaterialSelectorForwardType4: false,
      showMaterialSelectorForwardType5: false,
      showMaterialSelectorForwardType7: false,
      showMaterialSelectorForwardType8: false,
      submitting: false,
      specificationList: []
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    storeListLength () {
      return this.form.storeList.filter(v => v.type === 0).length
    }
  },
  watch: {
    kpiRank1 (newVal) {
      this.kpiRankData2 = this.getKpiRankData2(newVal)
      this.kpiRank2 = this.kpiRankData2[0].value
    }
  },
  created () {
    console.log('TaskDetail create')
    this.kpiRankData1 = this.getKpiRankData1(this.userInfo.storeType)
    this.kpiRankData2 = this.getKpiRankData2(this.userInfo.storeType)
    this.form._kpiRank = this.kpiRank1 + ',' + this.kpiRank2
    const id = this.$route.query.id || ''
    this.see = Boolean(this.$route.query.see) || false
    this.form.id = id
    id && this.getInfo()
  },
  mounted () {
    console.log('TaskDetail mounted')
  },
  destroyed () {
    console.log('TaskDetail destroyed')
  },
  methods: {
    getKpiRankData1 (storeType) { // storeType   门店类型 0总部 1分公司 2门店
      const defaultData = [
        {
          value: 0,
          label: '总部',
          children: [
            {
              value: 1,
              label: '分公司'
            },
            {
              value: 2,
              label: '门店'
            },
            {
              value: 3,
              label: '导购'
            }
          ]
        },
        {
          value: 1,
          label: '分公司',
          children: [
            {
              value: 2,
              label: '门店'
            },
            {
              value: 3,
              label: '导购'
            }
          ]
        },
        {
          value: 2,
          label: '门店',
          children: [
            {
              value: 3,
              label: '导购'
            }
          ]
        }
      ]
      if (storeType === 1) {
        defaultData.splice(0, 1)
        this.kpiRank1 = 1
      }
      if (storeType === 2) {
        defaultData.splice(0, 1)
        defaultData.splice(0, 1)
        this.kpiRank1 = 2
      }
      return defaultData
    },
    getKpiRankData2 (storeType) { // storeType   门店类型 0总部 1分公司 2门店
      const defaultData = [
        {
          value: 1,
          label: '分公司'
        },
        {
          value: 2,
          label: '门店'
        },
        {
          value: 3,
          label: '导购'
        }
      ]
      if (storeType === 1) {
        defaultData.splice(0, 1)
        this.kpiRank2 = 2
      }
      if (storeType === 2) {
        defaultData.splice(0, 1)
        defaultData.splice(0, 1)
        this.kpiRank2 = 3
      }
      return defaultData
    },
    addKpi () {
      this.form._kpiRule.push(getTaskItem3())
    },
    delKpi (index) {
      this.form._kpiRule.splice(index, 1)
    },
    // 选择活动
    activitySelectorChange (arr) {
      if (!arr[0]) return
      this.form._fansRule[0].activityId = arr[0]
      this.$refs['form'].validateField(['_fansRule.' + 0 + '.activityId'])
      this.getActivityInfo(arr[0])
    },
    chooseActivity () {
      this.isShowActivityDialog = true
    },
    getActivityInfo (id, cb) {
      ApiActivity.getInfo({ id }).then(({ data }) => {
        this.selectedActivity = data
        cb && cb(data)
      })
    },
    // 选择文章
    articleSelectorChange (arr) {
      if (!arr[0]) return
      const index = this.chooseArticleIndex
      this.form._articleRule[index].articleId = arr[0]
      ApiArticle.info({ articleId: arr[0] }).then(({ data }) => {
        this.form._articleRule[index].title = data.title
        this.form._articleRule[index].shareDesc = data.shareDesc
        this.form._articleRule[index].shareImg = data.shareImg
        this.form._articleRule[index].linkUrl = data.linkUrl
      })
      this.$refs['form'].validateField(['_articleRule.' + index + '.articleId'])
    },
    chooseArticle (index) {
      this.chooseArticleIndex = index
      this.isShowArticleDialog = true
    },
    // 选择商品
    goodsSelectorChange (json) {
      this.taskRangeListGoods = json.data
      this.getTaskRangeList()
      this.getKpiRange()
      this.$refs['form'].validateField(['_kpiRangeList'])
    },
    chooseGoods () {
      this.isShowGoodsDialog = true
    },
    // 选择拼团
    groupSelectorChange (arr) {
      this.taskRangeListGroup = arr
      this.getTaskRangeList()
      this.getKpiRange()
      this.$refs['form'].validateField(['_kpiRangeList'])
    },
    chooseGroup () {
      this.isShowGroupDialog = true
    },
    getKpiRange () {
      const arr = []
      if (this.taskRangeListGoods.length) {
        arr.push(1)
      }
      if (this.taskRangeListGroup.length) {
        arr.push(2)
      }
      this.form._kpiRange = arr.join(',')
    },
    getTaskRangeList () {
      this.form._kpiRangeList = this.taskRangeListGoods.map(v => ({
        productId: v,
        type: 1
      })).concat(this.taskRangeListGroup.map(v => ({
        activityId: v,
        type: 2
      })))
    },
    // 选择图片 - 转发软文
    materialSelectorChange (val) {
      this.form._articleRule[this.shareImgIndex].shareImg = val[0].imgUrl
      this.showMaterialSelector = false
    },
    chooseMaterial (index) {
      this.showMaterialSelector = true
      this.shareImgIndex = index
    },
    // 选择图片 - 转发图片
    materialSelectorChangeForwardType2 (val) {
      const obj = this.form._articleRule[this.shareImgIndexForwardType2]
      obj.taskRangeList = val.slice(0, 9).map(v => ({ activityId: v.id, linkUrl: v.imgUrl, type: 7 }))
      this.showMaterialSelectorForwardType2 = false
      this.$refs['form'].validateField(['_articleRule.' + this.shareImgIndexForwardType2 + '.taskRangeList'])
    },
    chooseMaterialForwardType2 (index) {
      this.showMaterialSelectorForwardType2 = true
      this.shareImgIndexForwardType2 = index
    },
    handleImgRemoveForwardType2 (index2, index) {
      this.form._articleRule[index].taskRangeList.splice(index2, 1)
    },
    // 选择视频 - 转发视频
    materialSelectorChangeForwardType3 (val) {
      const obj = this.form._articleRule[this.shareImgIndexForwardType3]
      obj.taskRangeList = val.map(v => ({ activityId: v.id, linkUrl: v.imgUrl, type: 8 }))
      this.showMaterialSelectorForwardType3 = false
      this.$refs['form'].validateField(['_articleRule.' + this.shareImgIndexForwardType3 + '.taskRangeList'])
    },
    chooseMaterialForwardType3 (index) {
      this.showMaterialSelectorForwardType3 = true
      this.shareImgIndexForwardType3 = index
    },
    handleImgRemoveForwardType3 (index2, index) {
      this.form._articleRule[index].taskRangeList.splice(index2, 1)
    },
    // 选择商品 - 转发商品
    materialSelectorChangeForwardType4 (val) {
      const obj = this.form._articleRule[this.shareImgIndexForwardType4]
      obj.taskRangeList = val.data.slice(0, 9).map(v => ({ productId: v, type: 1 }))
      this.showMaterialSelectorForwardType4 = false
      this.$refs['form'].validateField(['_articleRule.' + this.shareImgIndexForwardType4 + '.taskRangeList'])
    },
    chooseMaterialForwardType4 (index) {
      this.showMaterialSelectorForwardType4 = true
      this.shareImgIndexForwardType4 = index
    },
    // 选择优惠券 - 转发优惠券
    materialSelectorChangeForwardType5 (val) {
      const obj = this.form._articleRule[this.shareImgIndexForwardType5]
      obj.taskRangeList = val.slice(0, 9).map(v => ({ activityId: v.id, type: 6 }))
      this.showMaterialSelectorForwardType5 = false
      this.$refs['form'].validateField(['_articleRule.' + this.shareImgIndexForwardType5 + '.taskRangeList'])
    },
    chooseMaterialForwardType5 (index) {
      this.showMaterialSelectorForwardType5 = true
      this.shareImgIndexForwardType5 = index
    },
    // 选择砍价 - 转发砍价
    materialSelectorChangeForwardType7 (val) {
      const obj = this.form._articleRule[this.shareImgIndexForwardType7]
      obj.taskRangeList = val.slice(0, 9).map(v => ({ activityId: v, type: 10 }))
      this.showMaterialSelectorForwardType7 = false
      this.$refs['form'].validateField(['_articleRule.' + this.shareImgIndexForwardType7 + '.taskRangeList'])
    },
    chooseMaterialForwardType7 (index) {
      this.showMaterialSelectorForwardType7 = true
      this.shareImgIndexForwardType7 = index
    },
    // 选择瓜分券 - 转发瓜分券
    materialSelectorChangeForwardType8 (val) {
      const obj = this.form._articleRule[this.shareImgIndexForwardType8]
      obj.taskRangeList = val.slice(0, 9).map(v => ({ activityId: v, type: 11 }))
      this.showMaterialSelectorForwardType8 = false
      this.$refs['form'].validateField(['_articleRule.' + this.shareImgIndexForwardType8 + '.taskRangeList'])
    },
    chooseMaterialForwardType8 (index) {
      this.showMaterialSelectorForwardType8 = true
      this.shareImgIndexForwardType8 = index
    },
    addTask () {
      this.form._articleRule.push(getTaskItem2())
    },
    delTask (index) {
      this.form._articleRule.splice(index, 1)
    },
    handleValidHour () {
      this.form.validHour = this.form.validHour.replace(/\./ig, '')
    },
    confirmCheckedStore (data) {
      this.form.storeList = data
      // this.$refs['form'].clearValidate()
      this.$refs['form'].validateField(['storeList'])
    },
    getInfo () {
      ApiTask.info({ id: this.form.id }).then(res => {
        const data = res.data
        data.type = String(data.type)
        data._time = [data.beginTime, data.endTime]
        this.form = {
          ...getDefaultForm(),
          ...data
        }
        this.getInfoHandle()
        if (+this.form.type === 1) { // 吸粉
          this.getActivityInfo(this.form._fansRule[0].activityId)
        }
        if (+this.form.type === 2) { // 文章
          this.form._articleRule.forEach(v => {
            if (v.type === 1) {
              ApiArticle.info({ articleId: v.articleId }).then(({ data }) => {
                this.$set(v, 'title', data.title)
              })
            }
          })
        }
      })
    },
    submit () {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        this.submitting = true
        this.form.beginTime = this.form._time[0] || ''
        this.form.endTime = this.form._time[1] || ''
        this.submitHandle()
        ApiTask[this.form.id ? 'update' : 'save'](this.form).then(({ code, message }) => {
          this.$message({ type: (code === 'SUCCESS' ? 'success' : 'error'), message: message })
          if (code === 'SUCCESS') {
            this.$router.go(-1)
          }
          this.submitting = false
        }, () => {
          this.submitting = false
        })
      })
    },
    submitHandle () {
      if (+this.form.type === 1) { // 吸粉
        this.form.taskRuleList = this.form._fansRule
      }
      if (+this.form.type === 2) { // 文章
        this.form.taskRuleList = this.form._articleRule
        this.form._articleRule.forEach(v => {
          v.beginTime = v._time[0] || ''
          v.endTime = v._time[1] || ''
        })
      }
      if (+this.form.type === 3) { // 业绩
        this.form._kpiRank = this.kpiRank1 + ',' + this.kpiRank2
        this.form.taskRuleList = this.form._kpiRule
        this.form.kpiRank = this.form._kpiRank
        this.form.kpiRange = this.form._kpiRange
        this.form.taskRangeList = this.form._kpiRangeList
      }
      // 没在此处删除多余的下划线开头的字段，是因为如果删除了，后续保存失败时，页面继续操作会因数据丢失而大面积报错，导致流程无法继续。
    },
    getInfoHandle () {
      if (+this.form.type === 1) { // 吸粉
        this.form._fansRule = this.form.taskRuleList
      }
      if (+this.form.type === 2) { // 文章
        this.form._articleRule = this.form.taskRuleList
        this.form._articleRule.forEach(v => {
          v._time = [v.beginTime, v.endTime]
        })
      }
      if (+this.form.type === 3) { // 业绩
        this.form._kpiRule = this.form.taskRuleList
        this.form._kpiRank = this.form.kpiRank
        this.form._kpiRange = this.form.kpiRange
        this.form._kpiRangeList = this.form.taskRangeList
        const kpiRank = this.form._kpiRank.split(',')
        this.kpiRank1 = +kpiRank[0]
        this.kpiRank2 = +kpiRank[1]
        const taskRangeList = this.form._kpiRangeList
        const taskRangeListGoods = []
        const taskRangeListGroup = []
        taskRangeList.forEach(v => {
          if (+v.type === 1) { // 商品
            taskRangeListGoods.push(v.productId)
          }
          if (+v.type === 2) { // 拼团
            taskRangeListGroup.push(v.activityId)
          }
        })
        this.taskRangeListGoods = taskRangeListGoods
        this.taskRangeListGroup = taskRangeListGroup
      }
    },
    moveComponent (index, number) {
      this.form._articleRule[index] = this.form._articleRule.splice(index - number, 1, this.form._articleRule[index])[0]
      const list = this.form._articleRule
      setTimeout(() => { this.form._articleRule = list })

      // this.form._articleRule = []
      // this.$nextTick(() => {
      //   this.form._articleRule = list
      // })
      this.$message({ type: 'success', message: '移动成功，保存后生效' })
    }
  }
}
</script>

<style scoped lang="scss">
  .kpi-reward {
    margin-left: -80px;
  }

  .kpi-target {
    margin-bottom: 22px;
    margin-left: 20px;
  }

  .kpi-del {
    margin-bottom: 22px;
    margin-left: 20px;
  }

  .small {
    font-size: 12px;
    color: grey;
    margin-left: 5px;
  }

  .step {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .step-flex {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-right: 5px;
  }

  .goods {
    display: flex;

    .goods-img {
      width: 148px;
      height: 148px;
    }

    .goods-label {
      font-weight: bold;
    }

    .goods-content {
      margin-left: 10px;
      font-size: 14px;
    }

    .goods-content-name {
      display: flex;
      margin-bottom: 10px;
    }

    .goods-content-spec {
      display: flex;
      flex-wrap: wrap;
    }

    .goods-content-spec-item {
      margin-right: 10px;
      margin-bottom: 10px;
      padding: 4px 10px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 5px;
    }
  }

  .img-list {
    .img-item {
      display: inline-block;
      position: relative;
      margin-right: 20px;
      width: 100px;
      height: 100px;
      background-color: #fbfdff;
      border: 1px solid $--border-color-lighter;
      vertical-align: middle;
      margin-bottom: 10px;

      &.img-item_video {
        width: 300px;
        height: 300px;
      }

      .video {
        width: 100%;
        height: 100%;
      }

      // transition: all 0.25s;
      img {
        width: 100%;
        height: 100%;
        border-radius: 6px;
        vertical-align: middle;
      }

      .sort-bar {
        display: flex;
        justify-content: space-around;
        align-items: center;
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: white;
        font-weight: bold;
        background-color: rgba(0, 0, 0, 0.3);

        .icons {
          font-size: 16px;
          cursor: pointer;

          &:first-child {
            /*margin-right: 80px;*/
          }
        }
      }
    }
  }
</style>
