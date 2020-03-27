<template>
  <div class="order-wrapper">
    <div class="table" style="margin-top: 20px">
      <Table border ref="selection" :columns="columns4" :data="data1"></Table>
    </div>
    <div class="page">
      <Page :total="100" />
    </div>
  </div>
</template>

<script>
  export default {
    name: "manager-page",
    data(){
      return {
        mobileValue:'',
        model4:'',
        statusList:['待付款','已发货','已完成'],
        columns4: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: 'Name',
            key: 'name'
          },
          {
            title: 'Age',
            key: 'age'
          },
          {
            title: 'Address',
            key: 'address'
          }
        ],
        data1: [
          {
            name: 'John Brown',
            age: 18,
            address: 'New York No. 1 Lake Park',
            date: '2016-10-03'
          },
          {
            name: 'Jim Green',
            age: 24,
            address: 'London No. 1 Lake Park',
            date: '2016-10-01'
          },
          {
            name: 'Joe Black',
            age: 30,
            address: 'Sydney No. 1 Lake Park',
            date: '2016-10-02'
          },
          {
            name: 'Jon Snow',
            age: 26,
            address: 'Ottawa No. 2 Lake Park',
            date: '2016-10-04'
          }
        ]
      }
    }
  }
</script>

<style scoped>
  .page {
    margin: 20px 0 0;
    text-align: center;
  }
</style>
