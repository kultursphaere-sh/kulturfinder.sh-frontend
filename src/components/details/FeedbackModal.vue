<template>
  <b-modal
    centered
    ok-only
    :ok-title="$t('common.gotIt')"
    id="feedback-modal"
    :title="$t('details.feedback')"
    data-cy="feedbackModal"
  >
    <template>
      <b-container id="feedbackText" fluid data-cy="feedbackText">
        <b-row>
          <span>{{ $t('details.feedbackIntro') }}</span>
        </b-row>
        <b-row class="my-3">
          <a :href="`mailto:${email}?subject=Feedback ${institutionName}`" class="text-primary">{{ email }}</a>
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
  },
  computed: {
    email: function () { return process.env.VUE_APP_EMAIL }
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
