Rails.application.routes.draw do


  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root to: 'angular#index'
  get '/test_json' => 'angular#test_json'
  post '/test_pdf' => 'angular#generate_pdf'
  get '/get_pdf' => 'angular#get_pdf'
  get '/test_csv' => 'angular#generate_csv'
  post '/generate_quote' => 'quote#generate_quote'
  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'
  
  #Invalid route redirect to front end 
  
  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products
  resources :employee
  resources :payment
  resources :cartage_rate
  
  resources :sub_contractor
  resources :job do
    member do
      get 'full'
    end
  end
  
  resources :material
  
  resources :quote do
    member do
      post 'duplicate_quote'
    end
  end
  
  resources :job do
     member do
        post 'upload_docket' 
     end
  end
  # handle this internally, expose for testing purpose only
  #resources :mix_material
  
  resources :mix do
    member do
      put 'uncorrupted'
    end
  end
  
  resources :callup_register do 
    collection do
      get 'today'
      get 'tomorrow'
      get 'this_week'
      get 'this_month'
      get 'range/:range', action: 'get_in_range'
    end
  end
  
  get 'scheduler_log' => 'scheduler_log#index'
  resources :client do 
    collection do
      get 'job', action: 'get_client_job'
    end
  end
  resources :purchase do
    collection do
      get 'in_range', action: 'get_in_range'
    end
  end
  post 'preview_invoice' => 'invoice#preview'
  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
  
  # handle bad get route
  #get '*path' => redirect('/')
  
end
