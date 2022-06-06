((nil . ((org-publish-project-alist . (("org"
                                        :base-directory "."
                                        :base-extension "org"
                                        :publishing-directory "../../docs/tutorials/budgeter"
                                        :publishing-function org-docusaurus-publish-to-docusaurus
                                        :with-toc nil)
                                       ("images"
                                        :base-directory "."
                                        :base-extension "jpg\\|gif\\|png\\|svg"
                                        :publishing-directory "../../docs/tutorials/budgeter"
                                        :publishing-function org-publish-attachment)
                                       )))))
