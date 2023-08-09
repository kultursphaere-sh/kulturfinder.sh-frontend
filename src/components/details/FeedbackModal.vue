<template>
  <b-modal
    centered
    ok-only
    :ok-title="$t('common.gotIt')"
    id="feedback-modal"
    :title="$t('details.feedback')"
  >
    <template>
      <b-container id="feedbackText" fluid>
        <b-row>
          <span>{{ $t('details.feedbackIntro') }}</span>
        </b-row>
        <b-row class="my-3">
          <a :href="` mailto:${$t('details.feedbackEmail')}?subject=Feedback ${institutionName}`" class="text-primary">{{ $t('details.feedbackEmail') }}</a>
        </b-row>
        <b-row class="my-2">
          <span class="headline-feedback">{{ $t('details.feedbackInstitutionHeadline') }}</span>
        </b-row>
        <b-row class="">
          <span>{{ $t('details.feedbackInstitutionText') }}</span>
        </b-row>
        <b-row class="my-2">
          <span class="headline-feedback">{{ $t('details.feedbackWrongOpeningHoursHeadline') }}</span>
        </b-row>
        <b-row>
          <span>{{ $t('details.feedbackWrongOpeningHoursText') }}</span>
        </b-row>
      </b-container>
    </template>
  </b-modal>
</template>

<script>
export default {
  name: 'FeedbackModal',
  props: {
    institutionName: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
#feedbackText{
    text-align: left;
}
span{
    font-size: 0.8rem;
}
.headline-feedback{
    font-weight: 500;
    font-size: 0.8rem;
}
#notice{
    font-style: italic;
}
</style>
