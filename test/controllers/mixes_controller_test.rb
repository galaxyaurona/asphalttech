require 'test_helper'

class MixesControllerTest < ActionController::TestCase
  setup do
    @mix = mixes(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:mixes)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create mix" do
    assert_difference('Mix.count') do
      post :create, mix: { mix_material_set_id: @mix.mix_material_set_id, note: @mix.note, price_per_tonne: @mix.price_per_tonne }
    end

    assert_redirected_to mix_path(assigns(:mix))
  end

  test "should show mix" do
    get :show, id: @mix
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @mix
    assert_response :success
  end

  test "should update mix" do
    patch :update, id: @mix, mix: { mix_material_set_id: @mix.mix_material_set_id, note: @mix.note, price_per_tonne: @mix.price_per_tonne }
    assert_redirected_to mix_path(assigns(:mix))
  end

  test "should destroy mix" do
    assert_difference('Mix.count', -1) do
      delete :destroy, id: @mix
    end

    assert_redirected_to mixes_path
  end
end
